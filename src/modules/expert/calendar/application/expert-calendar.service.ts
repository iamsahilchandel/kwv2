import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '../../../../common/utils/pagination.util.js';
import type { CalendarQuery, UpcomingClassesQuery } from '../infrastructure/http/dto/expert-calendar.dto.js';

@Injectable()
export class ExpertCalendarService {
  private readonly logger = new Logger(ExpertCalendarService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCalendar(expertId: number, query: CalendarQuery) {
    const { startDate, endDate } = query;
    this.logger.log('Fetching calendar for expert', { expertId, startDate, endDate });

    const batches = await this.prisma.batches.findMany({
      where: {
        expertId,
        status: { in: ['active'] },
        startDate: { lte: endDate },
        OR: [{ endDate: null }, { endDate: { gte: startDate } }],
      },
      select: {
        id: true,
        batchName: true,
        batchType: true,
        startDate: true,
        endDate: true,
        status: true,
        frequency: true,
        service: { select: { id: true, serviceName: true } },
        center: { select: { id: true, centerName: true } },
        classes: {
          where: {
            classDate: { gte: startDate, lte: endDate },
          },
          select: {
            id: true,
            classDate: true,
            startTime: true,
            endTime: true,
            status: true,
            classType: true,
          },
          orderBy: { classDate: 'asc' },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return batches;
  }

  async getUpcomingClasses(expertId: number, query: UpcomingClassesQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const now = new Date();

    const [items, total] = await Promise.all([
      this.prisma.batchClasses.findMany({
        where: {
          expertId,
          status: 'scheduled',
          classDate: { gte: now },
        },
        skip,
        take,
        orderBy: { classDate: 'asc' },
        include: {
          batch: { select: { id: true, batchName: true, center: { select: { id: true, centerName: true } } } },
        },
      }),
      this.prisma.batchClasses.count({
        where: {
          expertId,
          status: 'scheduled',
          classDate: { gte: now },
        },
      }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }
}
