import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client.js';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { BatchClassMediaNotFoundException } from '../domain/errors/batch-class-media.errors.js';
import type { CreateBatchClassMediaBody, QueryMediaQuery } from '../infrastructure/http/dto/expert-batch-class-media.dto.js';

@Injectable()
export class ExpertBatchClassMediaService {
  private readonly logger = new Logger(ExpertBatchClassMediaService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(expertId: number, classId: number, query: QueryMediaQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { mediaType } = query;

    const where: Record<string, unknown> = {
      batchClassId: classId,
      expertId,
      isActive: true,
    };
    if (mediaType) where.mediaType = mediaType;

    const [items, total] = await Promise.all([
      this.prisma.batchClassMedia.findMany({
        where,
        skip,
        take,
        orderBy: { uploadedAt: 'desc' },
      }),
      this.prisma.batchClassMedia.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async create(expertId: number, classId: number, dto: CreateBatchClassMediaBody) {
    const batchClass = await this.prisma.batchClasses.findUnique({
      where: { id: classId },
      include: { batch: { select: { expertId: true } } },
    });

    if (!batchClass) throw new NotFoundException(`Batch class with id ${classId} not found`);
    if (batchClass.batch.expertId !== expertId) throw new ForbiddenException();

    this.logger.log('Creating batch class media', { expertId, classId });

    const { fileSize, metadata, ...rest } = dto;

    return this.prisma.batchClassMedia.create({
      data: {
        ...rest,
        batchClassId: classId,
        expertId,
        uploadedAt: new Date(),
        isActive: true,
        ...(fileSize !== undefined && { fileSize: BigInt(fileSize) }),
        ...(metadata !== undefined && { metadata: metadata as Prisma.InputJsonValue }),
      },
    });
  }

  async remove(expertId: number, mediaId: number) {
    const media = await this.prisma.batchClassMedia.findUnique({ where: { id: mediaId } });

    if (!media) throw new BatchClassMediaNotFoundException(mediaId);
    if (media.expertId !== expertId) throw new ForbiddenException();

    this.logger.log('Removing batch class media', { expertId, mediaId });

    return this.prisma.batchClassMedia.update({
      where: { id: mediaId },
      data: { isActive: false },
    });
  }
}
