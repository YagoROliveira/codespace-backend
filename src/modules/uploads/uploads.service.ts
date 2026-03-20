import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

/** Default signed-URL lifetime: 7 days (in ms) */
const SIGNED_URL_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

/** Refresh signed URL cache when less than 1 hour remains */
const SIGNED_URL_REFRESH_BUFFER_MS = 60 * 60 * 1000;

/** Image processing config per folder */
const IMAGE_PROFILES: Record<string, { maxWidth: number; maxHeight: number; quality: number }> = {
  avatars: { maxWidth: 256, maxHeight: 256, quality: 80 },
  covers: { maxWidth: 1200, maxHeight: 630, quality: 82 },
  general: { maxWidth: 1024, maxHeight: 1024, quality: 80 },
};
const DEFAULT_PROFILE = { maxWidth: 1024, maxHeight: 1024, quality: 80 };

interface CachedSignedUrl {
  url: string;
  expiresAt: number; // epoch ms
}

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private storage: Storage | null = null;
  private readonly bucketName: string;
  private readonly cdnBaseUrl: string;

  /** In-memory signed URL cache: objectPath → { url, expiresAt } */
  private readonly signedUrlCache = new Map<string, CachedSignedUrl>();

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('GCS_BUCKET', '');
    this.cdnBaseUrl = this.configService.get<string>('GCS_CDN_URL', '');

    const projectId = this.configService.get<string>('GCS_PROJECT_ID', '');
    const keyFilename = this.configService.get<string>('GCS_KEY_FILE', '');
    const credentials = this.configService.get<string>('GCS_CREDENTIALS', '');

    try {
      if (credentials) {
        let parsed: any;
        try {
          parsed = JSON.parse(credentials);
        } catch {
          parsed = JSON.parse(Buffer.from(credentials, 'base64').toString('utf-8'));
        }
        this.storage = new Storage({ projectId, credentials: parsed });
      } else if (keyFilename) {
        this.storage = new Storage({ projectId, keyFilename });
      } else {
        this.logger.warn('GCS not configured — uploads will fail');
      }
    } catch (err: any) {
      this.logger.error(`Failed to initialize GCS: ${err.message}`);
    }
  }

  // ─── Helpers ───────────────────────────────────────────────

  isGcsPath(value: string): boolean {
    return !!value && !value.startsWith('http');
  }

  extractPath(urlOrPath: string): string {
    if (!urlOrPath) return '';
    if (!urlOrPath.startsWith('http')) return urlOrPath;
    const marker = `${this.bucketName}/`;
    const idx = urlOrPath.indexOf(marker);
    if (idx !== -1) return urlOrPath.slice(idx + marker.length);
    const parts = urlOrPath.split('/');
    return parts.slice(-2).join('/');
  }

  // ─── Image Optimization ────────────────────────────────────

  /**
   * Compress and resize an image buffer using sharp.
   * Converts everything to WebP for best size/quality ratio.
   * Returns { buffer, contentType, ext }.
   */
  private async optimizeImage(
    buffer: Buffer,
    mimetype: string,
    folder: string,
  ): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
    const profile = IMAGE_PROFILES[folder] || DEFAULT_PROFILE;

    // SVGs pass through unchanged
    if (mimetype === 'image/svg+xml') {
      return { buffer, contentType: mimetype, ext: '.svg' };
    }

    // GIFs: resize but keep as GIF to preserve animation
    if (mimetype === 'image/gif') {
      const optimized = await sharp(buffer, { animated: true })
        .resize(profile.maxWidth, profile.maxHeight, { fit: 'inside', withoutEnlargement: true })
        .gif()
        .toBuffer();
      this.logger.log(`[IMG] GIF optimized: ${(buffer.length / 1024).toFixed(0)}KB → ${(optimized.length / 1024).toFixed(0)}KB`);
      return { buffer: optimized, contentType: 'image/gif', ext: '.gif' };
    }

    // Everything else → WebP
    const optimized = await sharp(buffer)
      .resize(profile.maxWidth, profile.maxHeight, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: profile.quality })
      .toBuffer();

    const origKB = (buffer.length / 1024).toFixed(0);
    const newKB = (optimized.length / 1024).toFixed(0);
    const savings = ((1 - optimized.length / buffer.length) * 100).toFixed(0);
    this.logger.log(`[IMG] Optimized: ${origKB}KB → ${newKB}KB (${savings}% smaller, WebP q${profile.quality})`);

    return { buffer: optimized, contentType: 'image/webp', ext: '.webp' };
  }

  // ─── Signed URL (with cache) ───────────────────────────────

  async getSignedUrl(
    objectPath: string,
    expiresMs = SIGNED_URL_EXPIRES_MS,
  ): Promise<{ url: string; expiresAt: string }> {
    if (!this.storage || !this.bucketName) {
      throw new InternalServerErrorException('File storage is not configured');
    }

    // Check cache — return if still valid with buffer
    const cached = this.signedUrlCache.get(objectPath);
    if (cached && cached.expiresAt - Date.now() > SIGNED_URL_REFRESH_BUFFER_MS) {
      return { url: cached.url, expiresAt: new Date(cached.expiresAt).toISOString() };
    }

    const file = this.storage.bucket(this.bucketName).file(objectPath);
    const expiresAt = new Date(Date.now() + expiresMs);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: expiresAt,
    });

    // Store in cache
    this.signedUrlCache.set(objectPath, { url, expiresAt: expiresAt.getTime() });

    // Evict old entries if cache grows too large (max 500)
    if (this.signedUrlCache.size > 500) {
      const now = Date.now();
      for (const [key, val] of this.signedUrlCache) {
        if (val.expiresAt < now) this.signedUrlCache.delete(key);
      }
    }

    this.logger.debug(`[GCS] Signed URL for "${objectPath}" expires ${expiresAt.toISOString()}`);
    return { url, expiresAt: expiresAt.toISOString() };
  }

  /**
   * Resolve an avatar field value to a displayable signed URL.
   */
  async resolveAvatarUrl(avatar: string | null | undefined): Promise<string | null> {
    if (!avatar) return null;
    if (avatar.startsWith('http')) {
      const objectPath = this.extractPath(avatar);
      if (objectPath && objectPath !== avatar) {
        try {
          const { url } = await this.getSignedUrl(objectPath);
          return url;
        } catch {
          return avatar;
        }
      }
      return avatar;
    }
    try {
      const { url } = await this.getSignedUrl(avatar);
      return url;
    } catch {
      return null;
    }
  }

  // ─── Upload ────────────────────────────────────────────────

  async upload(
    folder: string,
    file: Express.Multer.File,
  ): Promise<{ path: string; url: string; expiresAt: string }> {
    if (!this.storage || !this.bucketName) {
      throw new InternalServerErrorException('File storage is not configured');
    }

    const origSizeKB = (file.size / 1024).toFixed(1);
    this.logger.log(`[UPLOAD] Received ${file.originalname} (${origSizeKB}KB, ${file.mimetype}) → folder "${folder}"`);

    // Optimize the image
    const t0 = Date.now();
    const { buffer, contentType, ext } = await this.optimizeImage(file.buffer, file.mimetype, folder);
    const optimizeMs = Date.now() - t0;

    const filename = `${folder}/${randomUUID()}${ext}`;

    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(filename);

    try {
      const t1 = Date.now();
      await blob.save(buffer, {
        contentType,
        resumable: false,
        metadata: {
          cacheControl: 'public, max-age=31536000, immutable',
        },
      });
      const uploadMs = Date.now() - t1;

      const signed = await this.getSignedUrl(filename);

      this.logger.log(`[UPLOAD] Done: ${filename} (optimize=${optimizeMs}ms, upload=${uploadMs}ms, final=${(buffer.length / 1024).toFixed(0)}KB)`);
      return { path: filename, ...signed };
    } catch (err: any) {
      this.logger.error(`[GCS] Upload FAILED for ${filename}: ${err.message}`, err.stack);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  /**
   * Delete a file from GCS by its URL or path.
   */
  async delete(fileUrlOrPath: string): Promise<void> {
    if (!this.storage || !this.bucketName) return;

    try {
      const filename = this.extractPath(fileUrlOrPath);
      if (!filename) return;

      await this.storage.bucket(this.bucketName).file(filename).delete();
      this.signedUrlCache.delete(filename);
      this.logger.log(`Deleted file: ${filename}`);
    } catch (err: any) {
      this.logger.warn(`Failed to delete file: ${err.message}`);
    }
  }
}
