import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
  paginationParams,
  buildPaginatedResult,
} from '../../../../common/utils/pagination.util.js';
import type { PaginationQuery } from '../../../../common/dto/pagination.dto.js';

@Injectable()
export class LearnerAdvertisingBannersService {
  private readonly logger = new Logger(LearnerAdvertisingBannersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQuery) {
    const { skip, take, page, limit } = paginationParams(query);

    const where = {
      type: { in: ['learner', 'all'] as ('learner' | 'all')[] },
      isActive: true,
    };

    const [items, total] = await Promise.all([
      this.prisma.advertisingBanners.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.advertisingBanners.count({ where }),
    ]);

    this.logger.debug('Fetched learner advertising banners', { total, page });
    return buildPaginatedResult(items, total, page, limit);
  }
}
