export interface UploadResult {
  key: string;
  location: string;
  bucket: string;
  mimeType: string;
  size: number;
  originalName: string;
}

export interface DeleteResult {
  deleted: string[];
  failed: { key: string; error: string }[];
}

/** Port interface for S3 file operations. Allows swapping the S3 provider. */
export interface IS3Port {
  uploadPublic(file: Express.Multer.File): Promise<UploadResult>;
  uploadPrivate(file: Express.Multer.File): Promise<UploadResult>;
  deleteFiles(keys: string[]): Promise<DeleteResult>;
  getPresignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
  getPresignedUrls(
    keys: string[],
    expiresInSeconds?: number,
  ): Promise<Record<string, string>>;
}

export const S3_PORT = Symbol('IS3Port');
