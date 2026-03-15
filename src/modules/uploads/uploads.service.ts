import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';
import * as path from 'path';

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
        // JSON credentials string (for production/Vercel)
        this.storage = new Storage({
          projectId,
          credentials: JSON.parse(credentials),
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

  /**
   * Upload a file buffer to GCS and return the public URL.
   * @param folder  e.g. "avatars", "jobs", "resources"
   * @param file    multer file object
   */
  async upload(
    folder: string,
    file: Express.Multer.File,
  ): Promise<string> {
    if (!this.storage || !this.bucketName) {
      throw new InternalServerErrorException('File storage is not configured');
    }

    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `${folder}/${randomUUID()}${ext}`;

    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(filename);

    try {
      await blob.save(file.buffer, {
        contentType: file.mimetype,
        resumable: false,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });

      // Make public
      await blob.makePublic();

      // Return CDN URL or default GCS URL
      if (this.cdnBaseUrl) {
        return `${this.cdnBaseUrl}/${filename}`;
      }
      return `https://storage.googleapis.com/${this.bucketName}/${filename}`;
    } catch (err: any) {
      this.logger.error(`Upload failed: ${err.message}`);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  /**
   * Delete a file from GCS by its public URL.
   */
  async delete(fileUrl: string): Promise<void> {
    if (!this.storage || !this.bucketName) return;

    try {
      // Extract filename from URL
      const urlParts = fileUrl.split(`${this.bucketName}/`);
      if (urlParts.length < 2) return;
      const filename = urlParts[1];

      await this.storage.bucket(this.bucketName).file(filename).delete();
      this.logger.log(`Deleted file: ${filename}`);
    } catch (err: any) {
      this.logger.warn(`Failed to delete file: ${err.message}`);
    }
  }
}
