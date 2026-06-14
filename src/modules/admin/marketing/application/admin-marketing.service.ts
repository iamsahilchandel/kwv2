import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { NotificationsFcmService } from '../../../../modules/shared/notifications-fcm/application/notifications-fcm.service.js';
import type { SendPushNotificationBody } from '../infrastructure/http/dto/send-push-notification.dto.js';
import { MarketingUserType } from '../infrastructure/http/dto/send-push-notification.dto.js';

@Injectable()
export class AdminMarketingService {
  private readonly logger = new Logger(AdminMarketingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcm: NotificationsFcmService,
  ) {}

  async sendPushNotification(dto: SendPushNotificationBody, adminId: number) {
    this.logger.log('Sending marketing push notification', {
      adminId,
      userType: dto.userType,
      title: dto.title,
    });

    const userIds = await this.getUserIdsByType(dto.userType);

    if (!userIds.length) {
      this.logger.warn('No users found for marketing notification', {
        userType: dto.userType,
      });
      return { successCount: 0, failureCount: 0, targetUserCount: 0 };
    }

    const message = {
      title: dto.title,
      body: dto.body,
      imageUrl: dto.imageUrl,
      data: {
        notificationType: 'marketing',
        sentBy: String(adminId),
        sentAt: new Date().toISOString(),
      },
    };

    const result = await this.fcm.sendToUsers(dto.userType, userIds, message);

    this.logger.log('Marketing push notification sent', {
      adminId,
      userType: dto.userType,
      targetUserCount: userIds.length,
      ...result,
    });

    return { ...result, targetUserCount: userIds.length };
  }

  private async getUserIdsByType(
    userType: MarketingUserType,
  ): Promise<number[]> {
    switch (userType) {
      case MarketingUserType.appadmin:
        return (
          await this.prisma.appAdminStaff.findMany({
            where: { isActive: true },
            select: { id: true },
          })
        ).map((u) => u.id);
      case MarketingUserType.centerstaff:
        return (
          await this.prisma.centerStaff.findMany({
            where: { isActive: true },
            select: { id: true },
          })
        ).map((u) => u.id);
      case MarketingUserType.expert:
        return (
          await this.prisma.experts.findMany({
            where: { isActive: true },
            select: { id: true },
          })
        ).map((u) => u.id);
      case MarketingUserType.learner:
        return (
          await this.prisma.learners.findMany({ select: { id: true } })
        ).map((u) => u.id);
      default:
        return [];
    }
  }
}
