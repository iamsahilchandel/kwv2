import { Injectable, UnauthorizedException, Inject, Logger } from '@nestjs/common';
import type { Auth } from 'firebase-admin/auth';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { FIREBASE_AUTH } from '../../../core/firebase/firebase.module.js';
import type { IAuthUser } from '../../../common/interfaces/auth-user.interface.js';
import { FcmUserType } from '../../../generated/prisma/enums.js';

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(FIREBASE_AUTH) private readonly firebaseAuth: Auth,
  ) {}

  async verifyNumber(phoneNumber: string) {
    const admin = await this.prisma.appAdminStaff.findUnique({
      where: { phoneNumber },
      select: { id: true, fullName: true, role: true, isActive: true },
    });

    if (!admin) {
      throw new UnauthorizedException('Phone number not registered as admin');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Admin account is inactive');
    }

    return { fullName: admin.fullName, role: admin.role };
  }

  async login(user: IAuthUser, fcmToken?: string | null) {
    if (fcmToken) await this.upsertFcmToken(user.id, fcmToken, FcmUserType.admin);

    const admin = await this.prisma.appAdminStaff.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return admin;
  }

  async logout(user: IAuthUser, fcmToken?: string | null) {
    try {
      await this.firebaseAuth.revokeRefreshTokens(user.firebaseUid);
      this.logger.log('Admin refresh tokens revoked', { adminId: user.id, uid: user.firebaseUid });
    } catch (err: unknown) {
      const e = err as { errorInfo?: { code?: string; message?: string }; code?: string; message?: string };
      this.logger.error('Failed to revoke admin refresh tokens', {
        adminId: user.id,
        uid: user.firebaseUid,
        code: e?.errorInfo?.code ?? e?.code ?? 'unknown',
        message: e?.errorInfo?.message ?? e?.message ?? 'No message',
      });
      throw err;
    }
    if (fcmToken) await this.deactivateFcmToken(user.id, fcmToken, FcmUserType.admin);
    return { message: 'Logged out successfully' };
  }

  private async upsertFcmToken(
    userId: number,
    deviceToken: string,
    userType: FcmUserType,
  ) {
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

  private async deactivateFcmToken(
    userId: number,
    deviceToken: string,
    userType: FcmUserType,
  ) {
    await this.prisma.firebaseToken.updateMany({
      where: { deviceToken, userId, userType },
      data: { isActive: false },
    });
  }
}
