import { Injectable, Inject, Logger } from '@nestjs/common';
import { ExternalServiceException } from '../../../../common/exceptions/external-service.exception.js';
import {
  S3_PORT,
  type IS3Port,
  type UploadResult,
  type DeleteResult,
} from './ports/s3.port.js';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  constructor(@Inject(S3_PORT) private readonly s3: IS3Port) {}

  async uploadPublic(file: Express.Multer.File): Promise<UploadResult> {
    this.logger.log('Uploading public file to S3', {
      name: file.originalname,
      size: file.size,
      mime: file.mimetype,
    });
    try {
      const result = await this.s3.uploadPublic(file);
      this.logger.log('Public file uploaded', { key: result.key });
      return result;
    } catch (err) {
      this.logger.error('S3 public upload failed', (err as Error).stack, {
        name: file.originalname,
      });
      throw new ExternalServiceException('AWS S3', err);
    }
  }

  async uploadPrivate(file: Express.Multer.File): Promise<UploadResult> {
    this.logger.log('Uploading private file to S3', {
      name: file.originalname,
      size: file.size,
      mime: file.mimetype,
    });
    try {
      const result = await this.s3.uploadPrivate(file);
      this.logger.log('Private file uploaded', { key: result.key });
      return result;
    } catch (err) {
      this.logger.error('S3 private upload failed', (err as Error).stack, {
        name: file.originalname,
      });
      throw new ExternalServiceException('AWS S3', err);
    }
  }

  async deleteFiles(keys: string[]): Promise<DeleteResult> {
    this.logger.log('Deleting files from S3', { count: keys.length });
    try {
      const result = await this.s3.deleteFiles(keys);
      if (result.failed.length > 0) {
        this.logger.warn('Some S3 deletes failed', { failed: result.failed });
      }
      this.logger.log('S3 delete complete', {
        deleted: result.deleted.length,
        failed: result.failed.length,
      });
      return result;
    } catch (err) {
      this.logger.error('S3 delete failed', (err as Error).stack, { keys });
      throw new ExternalServiceException('AWS S3', err);
    }
  }

  async getPresignedUrl(key: string, expiresInSeconds = 300): Promise<string> {
    return this.s3.getPresignedUrl(key, expiresInSeconds);
  }

  async getPresignedUrls(
    keys: string[],
    expiresInSeconds = 300,
  ): Promise<Record<string, string>> {
    return this.s3.getPresignedUrls(keys, expiresInSeconds);
  }
}
