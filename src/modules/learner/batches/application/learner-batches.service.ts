import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
  paginationParams,
  buildPaginatedResult,
} from '../../../../common/utils/pagination.util.js';
import type { QueryBatchesDto } from '../infrastructure/http/dto/learner-batches.dto.js';

@Injectable()
export class LearnerBatchesService {
  private readonly logger = new Logger(LearnerBatchesService.name);

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

  async findAll(learnerId: number, query: QueryBatchesDto) {
    const profileId = await this.getProfileId(learnerId);
    const { skip, take, page, limit } = paginationParams(query);
    const {
      search,
      status,
      batchType,
      serviceId,
      expertId,
      startDateFrom,
      startDateTo,
    } = query;

    const enrollmentWhere: Record<string, unknown> = {
      learnerProfileId: profileId,
    };
    const batchWhere: Record<string, unknown> = {};

    if (status) batchWhere.status = status;
    if (batchType) batchWhere.batchType = batchType;
    if (serviceId) batchWhere.serviceId = serviceId;
    if (expertId) batchWhere.expertId = expertId;
    if (search)
      batchWhere.batchName = { contains: search, mode: 'insensitive' };
    if (startDateFrom || startDateTo) {
      const dateFilter: Record<string, Date> = {};
      if (startDateFrom) dateFilter.gte = startDateFrom;
      if (startDateTo) dateFilter.lte = startDateTo;
      batchWhere.startDate = dateFilter;
    }

    const [items, total] = await Promise.all([
      this.prisma.batchEnrollments.findMany({
        where: { ...enrollmentWhere, batch: batchWhere },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          batch: {
            include: {
              expert: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profilePicture: true,
                },
              },
              service: {
                select: { id: true, serviceName: true, serviceGroup: true },
              },
              center: { select: { id: true, centerName: true } },
              _count: { select: { classes: true } },
            },
          },
        },
      }),
      this.prisma.batchEnrollments.count({
        where: { ...enrollmentWhere, batch: batchWhere },
      }),
    ]);

    this.logger.debug('Fetched learner batches', { learnerId, total });
    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(learnerId: number, batchId: number) {
    const profileId = await this.getProfileId(learnerId);

    const enrollment = await this.prisma.batchEnrollments.findFirst({
      where: { batchId, learnerProfileId: profileId },
    });

    if (!enrollment)
      throw new ForbiddenException('You are not enrolled in this batch');

    const batch = await this.prisma.batches.findUnique({
      where: { id: batchId },
      include: {
        expert: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            phoneNumber: true,
          },
        },
        service: {
          select: { id: true, serviceName: true, serviceGroup: true },
        },
        center: { select: { id: true, centerName: true } },
        benefits: true,
        media: { select: { id: true, mediaKey: true, mediaType: true } },
        _count: { select: { enrollments: true, classes: true } },
      },
    });

    if (!batch) throw new NotFoundException(`Batch ${batchId} not found`);
    this.logger.debug('Fetched batch detail', { learnerId, batchId });
    return batch;
  }

  async getCalendar(learnerId: number, batchId: number) {
    const profileId = await this.getProfileId(learnerId);

    const enrollment = await this.prisma.batchEnrollments.findFirst({
      where: { batchId, learnerProfileId: profileId },
    });

    if (!enrollment)
      throw new ForbiddenException('You are not enrolled in this batch');

    const classes = await this.prisma.batchClasses.findMany({
      where: { batchId },
      orderBy: { classDate: 'asc' },
      select: {
        id: true,
        classDate: true,
        startTime: true,
        endTime: true,
        status: true,
        classType: true,
        expert: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    this.logger.debug('Fetched batch calendar for learner', {
      learnerId,
      batchId,
    });
    return classes;
  }

  async getClasses(learnerId: number, batchId: number) {
    const profileId = await this.getProfileId(learnerId);

    const enrollment = await this.prisma.batchEnrollments.findFirst({
      where: { batchId, learnerProfileId: profileId },
    });

    if (!enrollment)
      throw new ForbiddenException('You are not enrolled in this batch');

    const classes = await this.prisma.batchClasses.findMany({
      where: { batchId },
      orderBy: { classDate: 'asc' },
      include: {
        scheduledAttendance: {
          where: { learnerProfileId: profileId },
          select: {
            id: true,
            attendanceStatus: true,
            attendanceMarkedAt: true,
          },
        },
        classMedia: {
          select: { id: true, mediaKey: true, mediaType: true, fileName: true },
        },
        expert: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    this.logger.debug('Fetched batch classes for learner', {
      learnerId,
      batchId,
    });
    return classes;
  }
}
