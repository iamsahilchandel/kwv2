import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { Auth } from 'firebase-admin/auth';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { FIREBASE_AUTH } from '../../../core/firebase/firebase.module.js';
import type { IAuthUser } from '../../../common/interfaces/auth-user.interface.js';
import { FcmUserType } from '../../../generated/prisma/enums.js';

@Injectable()
export class CenterAuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(FIREBASE_AUTH) private readonly firebaseAuth: Auth,
  ) {}

  async verifyNumber(phoneNumber: string) {
    const staff = await this.prisma.centerStaff.findUnique({
      where: { phoneNumber },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        isActive: true,
        staffMemberships: {
          where: { center: { isActive: true } },
          select: {
            role: true,
            center: { select: { id: true, centerName: true } },
          },
        },
      },
    });

    if (!staff) {
      throw new UnauthorizedException(
        'Phone number not registered as center staff',
      );
    }

    if (!staff.isActive) {
      throw new UnauthorizedException('Center staff account is inactive');
    }

    if (staff.staffMemberships.length === 0) {
      throw new UnauthorizedException('No active center assignment found');
    }

    return {
      firstName: staff.firstName,
      lastName: staff.lastName,
      centers: staff.staffMemberships.map((m) => ({
        id: m.center.id,
        name: m.center.centerName,
        role: m.role,
      })),
    };
  }

  async login(user: IAuthUser, fcmToken: string) {
    await this.upsertFcmToken(user.id, fcmToken, FcmUserType.center);

    const staff = await this.prisma.centerStaff.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        isActive: true,
        staffMemberships: {
          select: {
            role: true,
            center: {
              select: {
                id: true,
                centerName: true,
                isActive: true,
                isOnboardingPaymentVerified: true,
              },
            },
          },
        },
      },
    });

    return staff;
  }

  async logout(user: IAuthUser, fcmToken: string) {
    await this.firebaseAuth.revokeRefreshTokens(user.firebaseUid);
    await this.deactivateFcmToken(user.id, fcmToken, FcmUserType.center);
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
