import { Injectable, Inject, Logger } from '@nestjs/common';
import type { Auth } from 'firebase-admin/auth';
import { PrismaService } from '@/core/database/prisma.service.js';
import { FIREBASE_AUTH } from '@/core/firebase/firebase.module.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { FcmUserType } from '@/generated/prisma/enums.js';

@Injectable()
export class ExpertAuthService {
  private readonly logger = new Logger(ExpertAuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(FIREBASE_AUTH) private readonly firebaseAuth: Auth,
  ) {}

  async login(user: IAuthUser, fcmToken: string) {
    this.logger.log('Expert login', { expertId: user.id });

    await this.upsertFcmToken(user.id, fcmToken, FcmUserType.expert);

    const expert = await this.prisma.experts.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        isActive: true,
        isVerified: true,
        expertMemberships: { select: { centerId: true } },
      },
    });

    this.logger.log('Expert login successful', { expertId: user.id });
    return expert;
  }

  async logout(user: IAuthUser, fcmToken: string) {
    this.logger.log('Expert logout', { expertId: user.id });

    await this.firebaseAuth.revokeRefreshTokens(user.firebaseUid);
    await this.deactivateFcmToken(user.id, fcmToken, FcmUserType.expert);

    return { message: 'Logged out successfully' };
  }

  private async upsertFcmToken(userId: number, deviceToken: string, userType: FcmUserType) {
    const existing = await this.prisma.firebaseToken.findFirst({
      where: { deviceToken },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.firebaseToken.update({
        where: { id: existing.id },
        data: { userId, userType, isActive: true, lastUsedAt: new Date() },
      });
    } else {
      await this.prisma.firebaseToken.create({
        data: { deviceToken, userId, userType, isActive: true },
      });
    }
  }

  private async deactivateFcmToken(userId: number, deviceToken: string, userType: FcmUserType) {
    await this.prisma.firebaseToken.updateMany({
      where: { deviceToken, userId, userType },
      data: { isActive: false },
    });
  }
}
