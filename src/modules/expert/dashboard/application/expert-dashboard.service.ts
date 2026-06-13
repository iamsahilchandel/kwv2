import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';

interface DashboardQuery {
  page: number;
  limit: number;
}

@Injectable()
export class ExpertDashboardService {
  private readonly logger = new Logger(ExpertDashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(expertId: number) {
    this.logger.log('Fetching dashboard metrics for expert', { expertId });

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const [
      activeBatches,
      totalEnrollments,
      scheduledClassesThisWeek,
      completedClasses,
      totalClasses,
    ] = await Promise.all([
      this.prisma.batches.count({ where: { expertId, status: 'active' } }),
      this.prisma.batchEnrollments.count({
        where: { batch: { expertId }, status: 'enrolled' },
      }),
      this.prisma.batchClasses.count({
        where: {
          expertId,
          status: 'scheduled',
          classDate: { gte: startOfWeek, lte: endOfWeek },
        },
      }),
      this.prisma.batchClasses.count({
        where: { expertId, status: 'completed' },
      }),
      this.prisma.batchClasses.count({ where: { expertId } }),
    ]);

    const completionRate = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

    return {
      activeBatches,
      totalEnrollments,
      scheduledClassesThisWeek,
      completionRate,
      completedClasses,
      totalClasses,
    };
  }

  async getUpcomingClasses(expertId: number, query: DashboardQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const now = new Date();
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(now.getDate() + 7);

    const [items, total] = await Promise.all([
      this.prisma.batchClasses.findMany({
        where: {
          expertId,
          status: 'scheduled',
          classDate: { gte: now, lte: sevenDaysLater },
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
          classDate: { gte: now, lte: sevenDaysLater },
        },
      }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getRecentBatches(expertId: number, query: DashboardQuery) {
    const { skip, take, page, limit } = paginationParams(query);

    const [items, total] = await Promise.all([
      this.prisma.batches.findMany({
        where: { expertId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          center: { select: { id: true, centerName: true } },
          service: { select: { id: true, serviceName: true } },
          _count: { select: { enrollments: true } },
        },
      }),
      this.prisma.batches.count({ where: { expertId } }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }
}
