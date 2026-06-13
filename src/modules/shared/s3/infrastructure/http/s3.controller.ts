import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { S3Service } from '../../application/s3.service.js';
import {
  DeleteFilesSchema,
  GetPresignedUrlsSchema,
  type DeleteFilesBody,
  type GetPresignedUrlsBody,
} from './dto/s3.dto.js';

@ApiTags('Shared - S3 File Management')
@ApiBearerAuth('firebase-token')
@UseGuards(AdminAuthGuard)
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @ApiOperation({
    summary: 'Upload files as public (publicly accessible URLs)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @Post('public')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadPublic(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new BadRequestException('No files provided');
    }
    const results = await Promise.all(
      files.map((f) => this.s3Service.uploadPublic(f)),
    );
    return { results, message: 'Files uploaded successfully' };
  }

  @ApiOperation({
    summary: 'Upload files as private (requires presigned URL to access)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadPrivate(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new BadRequestException('No files provided');
    }
    const results = await Promise.all(
      files.map((f) => this.s3Service.uploadPrivate(f)),
    );
    const keys = results.map((r) => r.key);
    const urlMap = await this.s3Service.getPresignedUrls(keys);
    const enriched = results.map((r) => ({
      ...r,
      presignedUrl: urlMap[r.key] ?? null,
    }));
    return { results: enriched, message: 'Files uploaded successfully' };
  }

  @ApiOperation({ summary: 'Delete one or more files from S3 by key' })
  @Post('delete')
  async deleteFiles(
    @Body(new ZodValidationPipe(DeleteFilesSchema)) dto: DeleteFilesBody,
  ) {
    const result = await this.s3Service.deleteFiles(dto.keys);
    return { ...result, message: `Deleted ${result.deleted.length} file(s)` };
  }

  @ApiOperation({ summary: 'Get presigned URLs for private files' })
  @Post('presigned-urls')
  async getPresignedUrls(
    @Body(new ZodValidationPipe(GetPresignedUrlsSchema))
    dto: GetPresignedUrlsBody,
  ) {
    const urlMap = await this.s3Service.getPresignedUrls(dto.keys);
    return urlMap;
  }
}
