import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';
import * as path from 'path';

/** Default signed-URL lifetime: 7 days (in ms) */
const SIGNED_URL_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private storage: Storage | null = null;
  private readonly bucketName: string;
  private readonly cdnBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('GCS_BUCKET', '');
    this.cdnBaseUrl = this.configService.get<string>('GCS_CDN_URL', '');

    const projectId = this.configService.get<string>('GCS_PROJECT_ID', '');
    const keyFilename = this.configService.get<string>('GCS_KEY_FILE', '');
    const credentials = this.configService.get<string>('GCS_CREDENTIALS', '');

    try {
      if (credentials) {
        // credentials can be raw JSON or base64-encoded JSON (Vercel)
        let parsed: any;
        try {
          parsed = JSON.parse(credentials);
        } catch {
          // Assume base64-encoded
          parsed = JSON.parse(Buffer.from(credentials, 'base64').toString('utf-8'));
        }
        this.storage = new Storage({
          projectId,
          credentials: parsed,
        });
      } else if (keyFilename) {
        // Key file path (for local dev)
        this.storage = new Storage({ projectId, keyFilename });
      } else {
        this.logger.warn('GCS not configured — uploads will fail');
      }
    } catch (err: any) {
      this.logger.error(`Failed to initialize GCS: ${err.message}`);
    }
  }

  // ─── Helpers ───────────────────────────────────────────────

  /**
   * Check if a value looks like a GCS object path (not an http URL).
   */
  isGcsPath(value: string): boolean {
    return !!value && !value.startsWith('http');
  }

  /**
   * Extract the GCS object path from a full URL or return as-is if already a path.
   *   "https://storage.googleapis.com/bucket/avatars/x.png" → "avatars/x.png"
   *   "avatars/x.png" → "avatars/x.png"
   */
  extractPath(urlOrPath: string): string {
    if (!urlOrPath) return '';
    if (!urlOrPath.startsWith('http')) return urlOrPath; // already a path
    // Try to extract after bucket name
    const marker = `${this.bucketName}/`;
    const idx = urlOrPath.indexOf(marker);
    if (idx !== -1) return urlOrPath.slice(idx + marker.length);
    // Fallback: take last two segments  (folder/file)
    const parts = urlOrPath.split('/');
    return parts.slice(-2).join('/');
  }

  // ─── Signed URL ────────────────────────────────────────────

  /**
   * Generate a signed URL for reading a GCS object.
   * @param objectPath  e.g. "avatars/uuid.png"
   * @param expiresMs   lifetime in ms (default 7 days)
   * @returns { url, expiresAt }
   */
  async getSignedUrl(
    objectPath: string,
    expiresMs = SIGNED_URL_EXPIRES_MS,
  ): Promise<{ url: string; expiresAt: string }> {
    if (!this.storage || !this.bucketName) {
      throw new InternalServerErrorException('File storage is not configured');
    }

    const file = this.storage.bucket(this.bucketName).file(objectPath);
    const expiresAt = new Date(Date.now() + expiresMs);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: expiresAt,
    });

    this.logger.debug(`[GCS] Signed URL for "${objectPath}" expires ${expiresAt.toISOString()}`);
    return { url, expiresAt: expiresAt.toISOString() };
  }

  /**
   * Resolve an avatar field value to a displayable signed URL.
   * Handles: null/empty → null, http URL (legacy) → as-is, GCS path → signed URL.
   */
  async resolveAvatarUrl(avatar: string | null | undefined): Promise<string | null> {
    if (!avatar) return null;
    if (avatar.startsWith('http')) {
      // Legacy full URL — convert to signed URL if it's from our bucket
      const objectPath = this.extractPath(avatar);
      if (objectPath && objectPath !== avatar) {
        try {
          const { url } = await this.getSignedUrl(objectPath);
          return url;
        } catch {
          return avatar; // fallback to original URL
        }
      }
      return avatar;
    }
    // It's a GCS object path
    try {
      const { url } = await this.getSignedUrl(avatar);
      return url;
    } catch {
      return null;
    }
  }

  // ─── Upload ────────────────────────────────────────────────

  /**
   * Upload a file buffer to GCS.
   * Returns the GCS object path and a pre-signed URL.
   */
  async upload(
    folder: string,
    file: Express.Multer.File,
  ): Promise<{ path: string; url: string; expiresAt: string }> {
    if (!this.storage || !this.bucketName) {
      throw new InternalServerErrorException('File storage is not configured');
    }

    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `${folder}/${randomUUID()}${ext}`;
    const sizeKB = (file.size / 1024).toFixed(1);

    this.logger.log(`[GCS] Uploading ${filename} (${sizeKB}KB, ${file.mimetype}) to bucket "${this.bucketName}"`);

    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(filename);

    try {
      const t0 = Date.now();
      await blob.save(file.buffer, {
        contentType: file.mimetype,
        resumable: false,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });
      this.logger.log(`[GCS] Saved ${filename} in ${Date.now() - t0}ms`);

      // Generate signed URL for immediate use
      const signed = await this.getSignedUrl(filename);

      this.logger.log(`[GCS] Upload complete: path=${filename} (total ${Date.now() - t0}ms)`);
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
      this.logger.log(`Deleted file: ${filename}`);
    } catch (err: any) {
      this.logger.warn(`Failed to delete file: ${err.message}`);
    }
  }
}
