import { Module } from '@nestjs/common';
import { S3Service } from './application/s3.service.js';
import { AwsS3Adapter } from './infrastructure/adapters/aws-s3.adapter.js';
import { S3Controller } from './infrastructure/http/s3.controller.js';
import { S3_PORT } from './application/ports/s3.port.js';

@Module({
  controllers: [S3Controller],
  providers: [S3Service, { provide: S3_PORT, useClass: AwsS3Adapter }],
  exports: [S3Service],
})
export class S3Module {}
