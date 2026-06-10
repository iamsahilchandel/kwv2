import { Injectable, Inject, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { ExternalServiceException } from '@/common/exceptions/external-service.exception.js';
import { FCM_PORT, type IFcmPort, type FcmMessage } from './ports/fcm.port.js';

export type UserType = 'appadmin' | 'centerstaff' | 'expert' | 'learner';
export type DeviceType = 'android' | 'ios' | 'web' | 'desktop';

const MAX_DEVICES_PER_USER = 10;
const INVALID_TOKEN_CODES = new Set([
  'messaging/invalid-registration-token',
  'messaging/registration-token-not-registered',
]);

@Injectable()
export class NotificationsFcmService {
  private readonly logger = new Logger(NotificationsFcmService.name);

  constructor(
    @Inject(FCM_PORT) private readonly fcm: IFcmPort,
    private readonly prisma: PrismaService,
  ) {}

  async registerDevice(
    userType: UserType,
    userId: number,
    fcmToken: string,
    deviceType: DeviceType = 'android',
    deviceInfo?: Record<string, unknown>,
  ) {
    await this.assertUserExists(userType, userId);

    const existing = await this.prisma.firebaseToken.findFirst({
      where: { userId, userType, deviceToken: fcmToken },
    });

    if (existing) {
      await this.prisma.firebaseToken.update({
        where: { id: existing.id },
        data: { deviceType, deviceInfo: deviceInfo ?? existing.deviceInfo, isActive: true, lastUsedAt: new Date() },
      });

      this.logger.log('FCM token updated for existing device', { userId, userType });
      return { isNewDevice: false, tokenId: existing.id };
    }

    // Enforce device limit — evict least-recently-used device when over limit
    const activeCount = await this.prisma.firebaseToken.count({ where: { userId, userType, isActive: true } });
    if (activeCount >= MAX_DEVICES_PER_USER) {
      const oldest = await this.prisma.firebaseToken.findFirst({
        where: { userId, userType, isActive: true },
        orderBy: { lastUsedAt: 'asc' },
      });
      if (oldest) {
        await this.prisma.firebaseToken.update({ where: { id: oldest.id }, data: { isActive: false } });
        this.logger.log('Evicted oldest FCM token due to device limit', { userId, userType });
      }
    }

    const created = await this.prisma.firebaseToken.create({
      data: { userId, userType, deviceToken: fcmToken, deviceType, deviceInfo, isActive: true, lastUsedAt: new Date() },
    });

    // Fire-and-forget: async token validation with Firebase — don't block the response
    this.validateAndDeactivateIfInvalid(fcmToken, created.id).catch(() => {});

    this.logger.log('FCM token registered for new device', { userId, userType });
    return { isNewDevice: true, tokenId: created.id };
  }

  async deactivateToken(userId: number, userType: UserType, fcmToken: string) {
    const result = await this.prisma.firebaseToken.updateMany({
      where: { userId, userType, deviceToken: fcmToken, isActive: true },
      data: { isActive: false },
    });

    this.logger.log('FCM token deactivated', { userId, userType, count: result.count });
    return { deactivatedCount: result.count };
  }

  async sendToUser(userType: UserType, userId: number, message: FcmMessage) {
    const tokens = await this.getActiveTokens(userType, [userId]);
    if (!tokens.length) {
      this.logger.warn('No active FCM tokens for user', { userId, userType });
      return { successCount: 0, failureCount: 0, reason: 'NO_ACTIVE_DEVICES' };
    }

    const result = await this.fcm.sendMulticast(tokens, message).catch((err) => {
      throw new ExternalServiceException('FCM', (err as Error).message);
    });

    await this.deactivateInvalidTokens(result.failedTokens);
    this.logger.log('Notification sent to user', { userId, userType, ...result });
    return result;
  }

  async sendToUsers(userType: UserType, userIds: number[], message: FcmMessage) {
    const tokens = await this.getActiveTokens(userType, userIds);
    if (!tokens.length) {
      this.logger.warn('No active FCM tokens for user batch', { count: userIds.length, userType });
      return { successCount: 0, failureCount: 0, reason: 'NO_ACTIVE_DEVICES' };
    }

    const result = await this.fcm.sendMulticast(tokens, message).catch((err) => {
      throw new ExternalServiceException('FCM', (err as Error).message);
    });

    await this.deactivateInvalidTokens(result.failedTokens);
    this.logger.log('Notification sent to user batch', { userType, userCount: userIds.length, ...result });
    return result;
  }

  private async getActiveTokens(userType: UserType, userIds: number[]): Promise<string[]> {
    const records = await this.prisma.firebaseToken.findMany({
      where: { userType, userId: { in: userIds }, isActive: true },
      select: { deviceToken: true },
    });
    // Remove duplicates
    return [...new Set(records.map((r) => r.deviceToken))];
  }

  private async deactivateInvalidTokens(failed: Array<{ token: string; errorCode: string }>) {
    const invalidTokens = failed
      .filter((f) => INVALID_TOKEN_CODES.has(f.errorCode))
      .map((f) => f.token);

    if (!invalidTokens.length) return;

    await this.prisma.firebaseToken.updateMany({
      where: { deviceToken: { in: invalidTokens }, isActive: true },
      data: { isActive: false },
    });

    this.logger.log('Deactivated invalid FCM tokens', { count: invalidTokens.length });
  }

  private async validateAndDeactivateIfInvalid(token: string, tokenId: number) {
    const valid = await this.fcm.validateToken(token);
    if (!valid) {
      await this.prisma.firebaseToken.update({ where: { id: tokenId }, data: { isActive: false } });
      this.logger.warn('FCM token failed Firebase validation and was deactivated', { tokenId });
    }
  }

  private async assertUserExists(userType: UserType, userId: number) {
    let exists = false;

    switch (userType) {
      case 'appadmin':
        exists = !!(await this.prisma.appAdminStaff.findUnique({ where: { id: userId }, select: { id: true } }));
        break;
      case 'centerstaff':
        exists = !!(await this.prisma.centerStaff.findUnique({ where: { id: userId }, select: { id: true } }));
        break;
      case 'expert':
        exists = !!(await this.prisma.expertProfile.findUnique({ where: { id: userId }, select: { id: true } }));
        break;
      case 'learner':
        exists = !!(await this.prisma.learnerProfile.findUnique({ where: { id: userId }, select: { id: true } }));
        break;
    }

    if (!exists) {
      throw new NotFoundException(`${userType} with ID ${userId} not found`);
    }
  }
}
