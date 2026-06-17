import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
  paginationParams,
  buildPaginatedResult,
} from '../../../../common/utils/pagination.util.js';
import type { PaginationQuery } from '../../../../common/dto/pagination.dto.js';

@Injectable()
export class LearnerReferralsService {
  private readonly logger = new Logger(LearnerReferralsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getReferralRewards(learnerId: number, query: PaginationQuery) {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
      select: { profileId: true },
    });

    if (!learner?.profileId)
      throw new ForbiddenException('Learner profile required');

    const { skip, take, page, limit } = paginationParams(query);

    const where = {
      status: { in: ['rewarded', 'used'] as ('rewarded' | 'used')[] },
      referrerId: Number(learner.profileId),
      referrerType: 'learner' as const,
    };

    const [items, total] = await Promise.all([
      this.prisma.referral.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          coupon: true,
        },
      }),
      this.prisma.referral.count({ where }),
    ]);

    this.logger.debug('Fetched referral rewards', { learnerId, total });
    return buildPaginatedResult(items, total, page, limit);
  }
}
