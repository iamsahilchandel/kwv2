import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { BatchNotFoundException } from '../domain/errors/expert-batches.errors.js';
import type { QueryExpertBatchesQuery } from '../infrastructure/http/dto/expert-batches.dto.js';

@Injectable()
export class ExpertBatchesService {
  private readonly logger = new Logger(ExpertBatchesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(expertId: number, query: QueryExpertBatchesQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { search, status, batchType } = query;

    const where: Record<string, unknown> = { expertId };
    if (status) where.status = status;
    if (batchType) where.batchType = batchType;
    if (search) where.batchName = { contains: search, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.batches.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          center: { select: { id: true, centerName: true } },
          service: { select: { id: true, serviceName: true } },
          _count: { select: { enrollments: true, classes: true } },
        },
      }),
      this.prisma.batches.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(expertId: number, batchId: number) {
    const batch = await this.prisma.batches.findUnique({
      where: { id: batchId },
      include: {
        center: { select: { id: true, centerName: true, address: true } },
        service: { select: { id: true, serviceName: true } },
        benefits: true,
        classes: {
          orderBy: { classDate: 'asc' },
          select: { id: true, classDate: true, startTime: true, endTime: true, status: true, classType: true },
        },
        _count: { select: { enrollments: true } },
      },
    });

    if (!batch) throw new BatchNotFoundException(batchId);
    if (batch.expertId !== expertId) throw new ForbiddenException();

    return batch;
  }

  async getEnrollments(expertId: number, batchId: number) {
    const batch = await this.prisma.batches.findUnique({ where: { id: batchId } });
    if (!batch) throw new BatchNotFoundException(batchId);
    if (batch.expertId !== expertId) throw new ForbiddenException();

    return this.prisma.batchEnrollments.findMany({
      where: { batchId },
      include: {
        learnerProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCalendar(expertId: number, batchId: number) {
    const batch = await this.prisma.batches.findUnique({ where: { id: batchId } });
    if (!batch) throw new BatchNotFoundException(batchId);
    if (batch.expertId !== expertId) throw new ForbiddenException();

    this.logger.log('Fetching calendar for batch', { expertId, batchId });

    return this.prisma.batchClasses.findMany({
      where: { batchId },
      orderBy: { classDate: 'asc' },
      select: {
        id: true,
        classDate: true,
        startTime: true,
        endTime: true,
        status: true,
        classType: true,
      },
    });
  }
}
