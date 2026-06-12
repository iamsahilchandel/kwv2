import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type {
  IS3Port,
  UploadResult,
  DeleteResult,
} from '../../application/ports/s3.port.js';

// Field-specific size limits in bytes (mirrors V1 config)
const FIELD_SIZE_LIMITS: Record<string, number> = {
  profilePicture: 5 * 1024 * 1024,
  expertAAdhaarFront: 10 * 1024 * 1024,
  expertAAdhaarBack: 10 * 1024 * 1024,
  centerStaffPan: 10 * 1024 * 1024,
  passport: 10 * 1024 * 1024,
  drivingLicense: 10 * 1024 * 1024,
  certificates: 15 * 1024 * 1024,
  galleryImage: 20 * 1024 * 1024,
  testimonialVideo: 100 * 1024 * 1024,
  galleryVideo: 200 * 1024 * 1024,
  demoVideo: 300 * 1024 * 1024,
  default: 100 * 1024 * 1024,
};

export const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/webm',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
]);

@Injectable()
export class AwsS3Adapter implements IS3Port {
  private readonly logger = new Logger(AwsS3Adapter.name);
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly config: ConfigService) {
    this.region = config.get<string>('aws.region') ?? '';
    this.bucket = config.get<string>('aws.s3BucketName') ?? '';

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: config.get<string>('aws.accessKeyId') ?? '',
        secretAccessKey: config.get<string>('aws.secretAccessKey') ?? '',
      },
      ...(config.get<string>('aws.endpoint') && {
        endpoint: config.get<string>('aws.endpoint'),
      }),
      forcePathStyle: true,
    });
  }

  async uploadPublic(file: Express.Multer.File): Promise<UploadResult> {
    return this.upload(file, 'public-read');
  }

  async uploadPrivate(file: Express.Multer.File): Promise<UploadResult> {
    return this.upload(file, 'private');
  }

  private async upload(
    file: Express.Multer.File,
    acl: 'public-read' | 'private',
  ): Promise<UploadResult> {
    this.validateFile(file);

    const folder = file.fieldname?.includes('Video') ? 'videos' : 'uploads';
    const safeName = file.originalname.replace(/\s+/g, '-');
    const key = `${folder}/${Date.now()}-${safeName}`;

    this.logger.log('Uploading to S3', { key, acl, size: file.size });

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: acl,
        Metadata: {
          fieldName: file.fieldname ?? '',
          contentType: file.mimetype,
        },
      }),
    );

    return {
      key,
      location: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`,
      bucket: this.bucket,
      mimeType: file.mimetype,
      size: file.size,
      originalName: file.originalname,
    };
  }

  async deleteFiles(keys: string[]): Promise<DeleteResult> {
    if (keys.length === 0) {
      return { deleted: [], failed: [] };
    }

    if (keys.length === 1) {
      try {
        await this.s3.send(
          new DeleteObjectCommand({ Bucket: this.bucket, Key: keys[0] }),
        );
        return { deleted: [keys[0]], failed: [] };
      } catch (err) {
        return {
          deleted: [],
          failed: [{ key: keys[0], error: (err as Error).message }],
        };
      }
    }

    const result = await this.s3.send(
      new DeleteObjectsCommand({
        Bucket: this.bucket,
        Delete: { Objects: keys.map((k) => ({ Key: k })), Quiet: false },
      }),
    );

    return {
      deleted: result.Deleted?.map((d) => d.Key ?? '') ?? [],
      failed:
        result.Errors?.map((e) => ({
          key: e.Key ?? '',
          error: e.Message ?? 'Unknown error',
        })) ?? [],
    };
  }

  async getPresignedUrl(key: string, expiresInSeconds = 300): Promise<string> {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      {
        expiresIn: expiresInSeconds,
      },
    );
  }

  async getPresignedUrls(
    keys: string[],
    expiresInSeconds = 300,
  ): Promise<Record<string, string>> {
    const results = await Promise.allSettled(
      keys.map(async (key) => ({
        key,
        url: await this.getPresignedUrl(key, expiresInSeconds),
      })),
    );

    return results.reduce<Record<string, string>>((acc, result) => {
      if (result.status === 'fulfilled') {
        acc[result.value.key] = result.value.url;
      } else {
        this.logger.warn('Failed to generate presigned URL', {
          reason: result.reason,
        });
      }
      return acc;
    }, {});
  }

  private validateFile(file: Express.Multer.File) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not allowed`);
    }

    const fieldLimit =
      FIELD_SIZE_LIMITS[file.fieldname ?? 'default'] ??
      FIELD_SIZE_LIMITS.default;
    if (file.size > fieldLimit) {
      throw new Error(
        `File "${file.originalname}" exceeds size limit of ${(fieldLimit / 1024 / 1024).toFixed(0)}MB`,
      );
    }
  }
}
