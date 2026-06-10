import { registerAs } from '@nestjs/config';

export const awsConfig = registerAs('aws', () => ({
  accessKeyId: process.env.KREO_WORLD_API_AWS_S3_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.KREO_WORLD_API_AWS_S3_SECRET_ACCESS_KEY ?? '',
  region: process.env.KREO_WORLD_API_AWS_S3_REGION ?? '',
  s3BucketName: process.env.KREO_WORLD_API_AWS_S3_BUCKET_NAME ?? '',
  endpoint: process.env.AWS_ENDPOINT_URL ?? undefined,
}));
