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
import type { QueryAttendanceDto } from '../infrastructure/http/dto/learner-attendance.dto.js';

@Injectable()
export class LearnerAttendanceService {
  private readonly logger = new Logger(LearnerAttendanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(learnerId: number, query: QueryAttendanceDto) {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
      select: { profileId: true },
    });

    if (!learner?.profileId) {
      throw new ForbiddenException(
        'Learner profile required to view attendance',
      );
    }

    const profileId = Number(learner.profileId);
    const { skip, take, page, limit } = paginationParams(query);
    const { batchId, status, startDate, endDate } = query;

    const where: Record<string, unknown> = { learnerProfileId: profileId };

    if (status) where.attendanceStatus = status;
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.gte = startDate;
      if (endDate) dateFilter.lte = endDate;
      where.createdAt = dateFilter;
    }

    if (batchId) {
      const enrollment = await this.prisma.batchEnrollments.findFirst({
        where: {
          batchId,
          learnerProfileId: profileId,
          status: { in: ['enrolled', 'completed'] },
        },
        select: { id: true },
      });

      if (!enrollment) {
        throw new NotFoundException(
          'You are not enrolled in this batch or enrollment is inactive',
        );
      }

      where.batchEnrollmentId = enrollment.id;
    }

    const [items, total] = await Promise.all([
      this.prisma.batchClassAttendence.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          batchClass: {
            select: {
              id: true,
              classDate: true,
              startTime: true,
              endTime: true,
              status: true,
              classType: true,
              batch: {
                select: {
                  id: true,
                  batchName: true,
                  batchType: true,
                  status: true,
                },
              },
            },
          },
          batchEnrollment: {
            select: { id: true, createdAt: true, status: true },
          },
        },
      }),
      this.prisma.batchClassAttendence.count({ where }),
    ]);

    const statsRaw = await this.prisma.batchClassAttendence.groupBy({
      by: ['attendanceStatus'],
      where: {
        learnerProfileId: profileId,
        ...(batchId && {
          batchEnrollmentId: where.batchEnrollmentId as number,
        }),
      },
      _count: true,
    });

    const stats = Object.fromEntries(
      statsRaw.map((s) => [s.attendanceStatus, s._count]),
    );

    this.logger.debug('Fetched attendance records', { learnerId, total });
    return {
      ...buildPaginatedResult(items, total, page, limit),
      statistics: {
        totalAttendance: total,
        attendanceByStatus: stats,
        attendanceRate: stats['present']
          ? Math.round((stats['present'] / total) * 100)
          : 0,
      },
    };
  }

  async findByBatch(learnerId: number, batchId: number) {
    const learner = await this.prisma.learners.findUnique({
      where: { id: learnerId },
      select: { profileId: true },
    });

    if (!learner?.profileId) {
      throw new ForbiddenException('Learner profile required');
    }

    const enrollment = await this.prisma.batchEnrollments.findFirst({
      where: {
        batchId,
        learnerProfileId: Number(learner.profileId),
        status: { in: ['enrolled', 'completed'] },
      },
      select: { id: true },
    });

    if (!enrollment) {
      throw new NotFoundException('You are not enrolled in this batch');
    }

    const records = await this.prisma.batchClassAttendence.findMany({
      where: {
        batchEnrollmentId: enrollment.id,
        learnerProfileId: Number(learner.profileId),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        batchClass: {
          select: {
            id: true,
            classDate: true,
            startTime: true,
            endTime: true,
            status: true,
            classType: true,
          },
        },
      },
    });

    this.logger.debug('Fetched batch attendance', {
      learnerId,
      batchId,
      count: records.length,
    });
    return records;
  }
}
