import {
  Injectable,
  Logger,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
  paginationParams,
  buildPaginatedResult,
} from '../../../../common/utils/pagination.util.js';
import {
  CenterNotFoundException,
  CenterAccessRequestNotFoundException,
} from '../domain/errors/center-access.errors.js';
import type {
  NearbyCentersDto,
  CenterAccessRequestDto,
  QueryMyCentersDto,
} from '../infrastructure/http/dto/learner-centers.dto.js';

@Injectable()
export class LearnerCentersService {
  private readonly logger = new Logger(LearnerCentersService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getProfileId(learnerId: number): Promise<number> {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
      select: { profileId: true },
    });
    if (!learner?.profileId)
      throw new ForbiddenException('Learner profile required');
    return Number(learner.profileId);
  }

  async findNearby(query: NearbyCentersDto) {
    const { lat, long, distance, page, limit, search } = query;
    const skip = (page - 1) * limit;

    // Convert distance (meters) to degrees (approx): 1 degree ≈ 111320 meters
    const distanceDegrees = distance / 111320;

    const searchFilter = search
      ? Prisma.sql`AND c.center_name ILIKE ${'%' + search + '%'}`
      : Prisma.empty;

    type NearbyCenter = {
      id: number;
      centerName: string;
      address: unknown;
      distance: number;
      total: bigint;
    };
    const results = await this.prisma.$queryRaw<NearbyCenter[]>`
      SELECT
        c.id,
        c.center_name AS "centerName",
        c.address,
        ST_DistanceSphere(
          c.geo_location,
          ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326)
        ) AS distance,
        COUNT(*) OVER() AS total
      FROM center c
      WHERE c.is_active = true
        AND ST_DWithin(
          c.geo_location,
          ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326),
          ${distanceDegrees}
        )
        ${searchFilter}
      ORDER BY distance ASC
      LIMIT ${limit} OFFSET ${skip}
    `;

    const total = results[0] ? Number(results[0].total) : 0;
    this.logger.log('Nearby centers search', { lat, long, distance, total });
    return buildPaginatedResult(results, total, page, limit);
  }

  async findMyCenters(learnerId: number, query: QueryMyCentersDto) {
    const profileId = await this.getProfileId(learnerId);
    const { skip, take, page, limit } = paginationParams(query);

    const [items, total] = await Promise.all([
      this.prisma.center.findMany({
        where: {
          isActive: true,
          batches: {
            some: {
              enrollments: {
                some: { learnerProfileId: profileId, status: 'enrolled' },
              },
            },
          },
        },
        skip,
        take,
        orderBy: { centerName: 'asc' },
        select: {
          id: true,
          centerName: true,
          address: true,
          media: {
            where: { mediaType: 'logo' },
            select: { id: true, mediaKey: true },
            take: 1,
          },
        },
      }),
      this.prisma.center.count({
        where: {
          isActive: true,
          batches: {
            some: {
              enrollments: {
                some: { learnerProfileId: profileId, status: 'enrolled' },
              },
            },
          },
        },
      }),
    ]);

    this.logger.debug('Fetched learner centers', { learnerId, total });
    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(id: number) {
    const center = await this.prisma.center.findUnique({
      where: { id, isActive: true },
      include: {
        media: { select: { id: true, mediaKey: true, mediaType: true } },
        centerServices: {
          include: {
            service: {
              select: { id: true, serviceName: true, serviceGroup: true },
            },
          },
        },
        centerAmenities: {
          include: { amenity: { select: { id: true, amenityName: true } } },
        },
        _count: { select: { batches: true } },
      },
    });

    if (!center) throw new CenterNotFoundException(id);
    return center;
  }

  async getCenterExperts(centerId: number) {
    const center = await this.prisma.center.findUnique({
      where: { id: centerId, isActive: true },
      select: { id: true },
    });

    if (!center) throw new CenterNotFoundException(centerId);

    return this.prisma.centerHasManyExperts.findMany({
      where: { centerId, isActive: true },
      include: {
        expert: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            experties: {
              select: {
                service: { select: { id: true, serviceName: true } },
                experienceYears: true,
              },
            },
          },
        },
      },
    });
  }

  async getAccessRequests(learnerId: number) {
    const profileId = await this.getProfileId(learnerId);

    return this.prisma.learnerCenterAccessRequests.findMany({
      where: { learnerProfileId: profileId },
      orderBy: { createdAt: 'desc' },
      include: {
        center: { select: { id: true, centerName: true, address: true } },
      },
    });
  }

  async createAccessRequest(learnerId: number, dto: CenterAccessRequestDto) {
    const profileId = await this.getProfileId(learnerId);

    const center = await this.prisma.center.findUnique({
      where: { id: dto.centerId, isActive: true },
      select: { id: true },
    });

    if (!center) throw new CenterNotFoundException(dto.centerId);

    const existing = await this.prisma.learnerCenterAccessRequests.findFirst({
      where: {
        learnerProfileId: profileId,
        centerId: dto.centerId,
        requestStatus: 'pending',
      },
    });

    if (existing) {
      throw new ConflictException(
        'Access request already exists for this center',
      );
    }

    this.logger.log('Creating center access request', {
      learnerId,
      centerId: dto.centerId,
    });
    return this.prisma.learnerCenterAccessRequests.create({
      data: {
        learnerProfileId: profileId,
        centerId: dto.centerId,
        requestMessage: dto.message,
        requestStatus: 'pending',
      },
    });
  }

  async deleteAccessRequest(learnerId: number, requestId: number) {
    const profileId = await this.getProfileId(learnerId);

    const request = await this.prisma.learnerCenterAccessRequests.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new CenterAccessRequestNotFoundException(requestId);
    if (request.learnerProfileId !== profileId) throw new ForbiddenException();

    await this.prisma.learnerCenterAccessRequests.delete({
      where: { id: requestId },
    });
    this.logger.log(`Deleted center access request ${requestId}`, {
      learnerId,
    });
    return { message: 'Access request deleted' };
  }
}
