import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '../../../../common/utils/pagination.util.js';
import type { QueryExpertLearnersQuery } from '../infrastructure/http/dto/expert-learners.dto.js';

@Injectable()
export class ExpertLearnersService {
  private readonly logger = new Logger(ExpertLearnersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(expertId: number, query: QueryExpertLearnersQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { search } = query;

    this.logger.log('Fetching learners for expert', { expertId });

    const enrollmentWhere: Record<string, unknown> = {
      status: 'enrolled',
      batch: { expertId, status: 'active' },
    };

    if (search) {
      enrollmentWhere.learnerProfile = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search } },
        ],
      };
    }

    // Get all enrolled learner profile IDs to deduplicate
    const allEnrollments = await this.prisma.batchEnrollments.findMany({
      where: enrollmentWhere,
      select: { learnerProfileId: true },
      distinct: ['learnerProfileId'],
    });

    const totalUnique = allEnrollments.length;
    const uniqueIds = allEnrollments.slice(skip, skip + take).map((e) => e.learnerProfileId);

    const learners = await this.prisma.learnerProfiles.findMany({
      where: { id: { in: uniqueIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
      },
    });

    return buildPaginatedResult(learners, totalUnique, page, limit);
  }

  async findOne(expertId: number, learnerId: number) {
    this.logger.log('Fetching learner detail for expert', { expertId, learnerId });

    const learner = await this.prisma.learnerProfiles.findUnique({
      where: { id: learnerId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
      },
    });

    if (!learner) throw new NotFoundException(`Learner with id ${learnerId} not found`);

    const enrollments = await this.prisma.batchEnrollments.findMany({
      where: {
        learnerProfileId: learnerId,
        batch: { expertId },
      },
      include: {
        batch: {
          select: {
            id: true,
            batchName: true,
            status: true,
            service: { select: { id: true, serviceName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { ...learner, enrollments };
  }
}
