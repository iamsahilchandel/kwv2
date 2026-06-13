import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NotificationStatus } from '@/generated/prisma/enums.js';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import type { QueryNotificationsQuery } from '../infrastructure/http/dto/expert-notifications.dto.js';

@Injectable()
export class ExpertNotificationsService {
  private readonly logger = new Logger(ExpertNotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(expertId: number, query: QueryNotificationsQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { isRead } = query;

    const where: Record<string, unknown> = {
      userType: 'expert',
      userId: BigInt(expertId),
    };

    // readAt = null means unread; readAt IS NOT NULL means read
    if (isRead === true) {
      where.readAt = { not: null };
    } else if (isRead === false) {
      where.readAt = null;
    }

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

  async markRead(expertId: number, notificationId: string) {
    const id = BigInt(notificationId);
    const userId = BigInt(expertId);

    const notification = await this.prisma.notifications.findFirst({
      where: { id, userId, userType: 'expert' },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with id ${notificationId} not found`);
    }

    this.logger.log('Marking notification as read', { expertId, notificationId });

    return this.prisma.notifications.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(expertId: number) {
    const userId = BigInt(expertId);

    this.logger.log('Marking all notifications as read for expert', { expertId });

    const result = await this.prisma.notifications.updateMany({
      where: {
        userType: 'expert',
        userId,
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return { updated: result.count };
  }

  async getStats(expertId: number) {
    const userId = BigInt(expertId);

    const [total, unread, sent] = await Promise.all([
      this.prisma.notifications.count({ where: { userType: 'expert', userId } }),
      this.prisma.notifications.count({
        where: { userType: 'expert', userId, readAt: null },
      }),
      this.prisma.notifications.count({
        where: { userType: 'expert', userId, status: NotificationStatus.sent },
      }),
    ]);

    return { total, unread, sent };
  }
}
