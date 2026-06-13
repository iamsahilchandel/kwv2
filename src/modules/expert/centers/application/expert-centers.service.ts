import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import type { QueryExpertCentersQuery } from '../infrastructure/http/dto/expert-centers.dto.js';

@Injectable()
export class ExpertCentersService {
  private readonly logger = new Logger(ExpertCentersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(expertId: number, query: QueryExpertCentersQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { search } = query;

    const where: Record<string, unknown> = { expertId, isActive: true };
    if (search) {
      where.center = { centerName: { contains: search, mode: 'insensitive' } };
    }

    const [items, total] = await Promise.all([
      this.prisma.centerHasManyExperts.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'desc' },
        include: {
          center: {
            select: {
              id: true,
              centerName: true,
              address: true,
              phoneNumber: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.centerHasManyExperts.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(expertId: number, centerId: number) {
    this.logger.log('Fetching center detail for expert', { expertId, centerId });

    const membership = await this.prisma.centerHasManyExperts.findFirst({
      where: { expertId, centerId, isActive: true },
      include: {
        center: {
          include: {
            _count: {
              select: {
                experts: true,
                batches: true,
              },
            },
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException(`Center with id ${centerId} not found or expert is not an active member`);
    }

    return membership;
  }
}
