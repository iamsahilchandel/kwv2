import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '../../../../common/utils/pagination.util.js';
import type { QueryMyExpertsDto, QueryGlobalExpertsDto } from '../infrastructure/http/dto/learner-experts.dto.js';

@Injectable()
export class LearnerExpertsService {
  private readonly logger = new Logger(LearnerExpertsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getProfileId(learnerId: number): Promise<number> {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
      select: { profileId: true },
    });
    if (!learner?.profileId) throw new ForbiddenException('Learner profile required');
    return Number(learner.profileId);
  }

  private parseIds(commaSeparated?: string): number[] {
    if (!commaSeparated) return [];
    return commaSeparated.split(',').map(Number).filter((n) => !isNaN(n));
  }

  async findMyExperts(learnerId: number, query: QueryMyExpertsDto) {
    const profileId = await this.getProfileId(learnerId);
    const { skip, take, page, limit } = paginationParams(query);
    const activityIds = this.parseIds(query.activityIds);

    const enrollmentWhere: Record<string, unknown> = {
      learnerProfileId: profileId,
      status: { in: ['enrolled', 'completed'] },
    };

    const batchWhere: Record<string, unknown> = {};
    if (query.search) {
      batchWhere.expert = {
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } },
        ],
      };
    }
    if (activityIds.length > 0) {
      batchWhere.serviceId = { in: activityIds };
    }

    const enrollments = await this.prisma.batchEnrollments.findMany({
      where: { ...enrollmentWhere, batch: batchWhere },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        batch: {
          include: {
            expert: {
              select: { id: true, firstName: true, lastName: true, profilePicture: true, mediaKey: true },
            },
            service: { select: { id: true, serviceName: true, serviceGroup: true } },
            center: { select: { id: true, centerName: true } },
          },
        },
      },
    });

    // De-duplicate by expert across enrollments
    const expertMap = new Map<number, unknown>();
    for (const e of enrollments) {
      const expert = e.batch?.expert;
      if (expert && !expertMap.has(expert.id)) {
        expertMap.set(expert.id, {
          expert,
          service: e.batch?.service,
          center: e.batch?.center,
          enrollmentId: e.id,
        });
      }
    }

    const items = Array.from(expertMap.values());
    const total = await this.prisma.batchEnrollments.count({ where: { ...enrollmentWhere, batch: batchWhere } });

    this.logger.debug('Fetched learner experts', { learnerId, uniqueExperts: items.length });
    return buildPaginatedResult(items, total, page, limit);
  }

  async findGlobalExperts(query: QueryGlobalExpertsDto) {
    const { page, limit, search, lat, long, distance, activityIds } = query;
    const activityIdList = this.parseIds(activityIds);
    const skip = (page - 1) * limit;

    if (lat !== undefined && long !== undefined) {
      const distanceDegrees = distance / 111320;
      type GlobalExpert = { id: number; firstName: string; lastName: string; mediaKey: string; distance: number; total: bigint };
      const results = await this.prisma.$queryRaw<GlobalExpert[]>`
        SELECT
          e.id,
          e.first_name AS "firstName",
          e.last_name AS "lastName",
          e.media_key AS "mediaKey",
          ST_DistanceSphere(
            e.location_for_work,
            ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326)
          ) AS distance,
          COUNT(*) OVER() AS total
        FROM experts e
        WHERE e.is_active = true
          AND e.location_for_work IS NOT NULL
          AND ST_DWithin(
            e.location_for_work,
            ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326),
            ${distanceDegrees}
          )
          ${search ? Prisma.sql`AND (e.first_name ILIKE ${'%' + search + '%'} OR e.last_name ILIKE ${'%' + search + '%'})` : Prisma.empty}
        ORDER BY distance ASC
        LIMIT ${limit} OFFSET ${skip}
      `;
      const total = results[0] ? Number(results[0].total) : 0;
      this.logger.debug('Global expert search (spatial)', { lat, long, total });
      return buildPaginatedResult(results, total, page, limit);
    }

    const where: Record<string, unknown> = { isActive: true };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (activityIdList.length > 0) {
      where.experties = { some: { expertiesId: { in: activityIdList } } } as Record<string, unknown>;
    }

    const [items, total] = await Promise.all([
      this.prisma.experts.findMany({
        where,
        skip,
        take: limit,
        orderBy: { firstName: 'asc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          mediaKey: true,
          gender: true,
          experties: {
            select: {
              experienceYears: true,
              service: { select: { id: true, serviceName: true } },
            },
            take: 3,
          },
        },
      }),
      this.prisma.experts.count({ where }),
    ]);

    this.logger.debug('Global expert search', { total });
    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(expertId: number) {
    const expert = await this.prisma.experts.findUnique({
      where: { id: expertId, isActive: true },
      include: {
        experties: {
          include: { service: { select: { id: true, serviceName: true, serviceGroup: true } } },
        },
        about: true,
        media: { select: { id: true, mediaKey: true, mediaType: true } },
        expertMemberships: {
          where: { isActive: true },
          include: { center: { select: { id: true, centerName: true, address: true } } },
        },
      },
    });

    if (!expert) throw new NotFoundException(`Expert ${expertId} not found`);
    return expert;
  }
}
