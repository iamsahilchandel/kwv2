import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NotificationStatus } from '@/generated/prisma/enums.js';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import type { QueryNotificationsQuery } from '../infrastructure/http/dto/learner-notifications.dto.js';

@Injectable()
export class LearnerNotificationsService {
  private readonly logger = new Logger(LearnerNotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(learnerId: number, query: QueryNotificationsQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { isRead } = query;

    const where: Record<string, unknown> = {
      userType: 'learner',
      userId: BigInt(learnerId),
    };

    if (isRead === true) where.readAt = { not: null };
    else if (isRead === false) where.readAt = null;

    const [items, total] = await Promise.all([
      this.prisma.notifications.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notifications.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async markRead(learnerId: number, notificationId: string) {
    const id = BigInt(notificationId);
    const userId = BigInt(learnerId);

    const notification = await this.prisma.notifications.findFirst({
      where: { id, userId, userType: 'learner' },
    });

    if (!notification) {
      throw new NotFoundException(`Notification ${notificationId} not found`);
    }

    this.logger.log('Marking notification as read', { learnerId, notificationId });
    return this.prisma.notifications.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(learnerId: number) {
    const userId = BigInt(learnerId);
    this.logger.log('Marking all notifications as read', { learnerId });

    const result = await this.prisma.notifications.updateMany({
      where: { userType: 'learner', userId, readAt: null },
      data: { readAt: new Date() },
    });

    return { updated: result.count };
  }

  async getStats(learnerId: number) {
    const userId = BigInt(learnerId);

    const [total, unread, sent] = await Promise.all([
      this.prisma.notifications.count({ where: { userType: 'learner', userId } }),
      this.prisma.notifications.count({ where: { userType: 'learner', userId, readAt: null } }),
      this.prisma.notifications.count({
        where: { userType: 'learner', userId, status: NotificationStatus.sent },
      }),
    ]);

    return { total, unread, sent };
  }
}
