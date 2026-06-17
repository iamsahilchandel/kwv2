import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import type { CalendarQueryDto } from '../infrastructure/http/dto/learner-calendar.dto.js';

@Injectable()
export class LearnerCalendarService {
  private readonly logger = new Logger(LearnerCalendarService.name);

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

  async getCalendar(learnerId: number, query: CalendarQueryDto) {
    const profileId = await this.getProfileId(learnerId);
    const { startDate, endDate, centerId, serviceId, batchType, status } =
      query;

    const today = new Date();
    const rangeStart =
      startDate ?? new Date(today.getFullYear(), today.getMonth(), 1);
    const rangeEnd =
      endDate ?? new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const batchWhere: Record<string, unknown> = {};
    if (status) batchWhere.status = status;
    if (batchType) batchWhere.batchType = batchType;
    if (serviceId) batchWhere.serviceId = serviceId;
    if (centerId) batchWhere.centerId = centerId;

    const enrollments = await this.prisma.batchEnrollments.findMany({
      where: {
        learnerProfileId: profileId,
        status: { in: ['enrolled', 'rescheduled'] },
        batch: batchWhere,
      },
      select: { batchId: true },
    });

    const batchIds = enrollments.map((e) => e.batchId);

    if (batchIds.length === 0) {
      return {
        events: [],
        dateRange: { start: rangeStart, end: rangeEnd },
        totalBatches: 0,
        totalClasses: 0,
      };
    }

    const classes = await this.prisma.batchClasses.findMany({
      where: {
        batchId: { in: batchIds },
        classDate: { gte: rangeStart, lte: rangeEnd },
      },
      orderBy: { classDate: 'asc' },
      include: {
        batch: {
          select: {
            id: true,
            batchName: true,
            batchType: true,
            status: true,
            service: { select: { id: true, serviceName: true } },
            center: { select: { id: true, centerName: true } },
          },
        },
        expert: { select: { id: true, firstName: true, lastName: true } },
        scheduledAttendance: {
          where: { learnerProfileId: profileId },
          select: { attendanceStatus: true },
        },
      },
    });

    this.logger.debug('Fetched learner calendar', {
      learnerId,
      classCount: classes.length,
    });
    return {
      events: classes,
      dateRange: { start: rangeStart, end: rangeEnd },
      totalBatches: batchIds.length,
      totalClasses: classes.length,
    };
  }

  async getUpcomingClasses(learnerId: number) {
    const profileId = await this.getProfileId(learnerId);

    const enrollments = await this.prisma.batchEnrollments.findMany({
      where: {
        learnerProfileId: profileId,
        status: { in: ['enrolled', 'rescheduled'] },
      },
      select: { batchId: true },
    });

    const batchIds = enrollments.map((e) => e.batchId);
    if (batchIds.length === 0) return [];

    const classes = await this.prisma.batchClasses.findMany({
      where: {
        batchId: { in: batchIds },
        classDate: { gte: new Date() },
        status: { in: ['scheduled', 'rescheduled'] },
      },
      orderBy: { classDate: 'asc' },
      take: 10,
      include: {
        batch: {
          select: {
            id: true,
            batchName: true,
            service: { select: { id: true, serviceName: true } },
            center: { select: { id: true, centerName: true } },
          },
        },
        expert: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    this.logger.debug('Fetched upcoming classes for learner', {
      learnerId,
      count: classes.length,
    });
    return classes;
  }
}
