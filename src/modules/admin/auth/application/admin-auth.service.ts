import { Injectable, Inject, Logger } from '@nestjs/common';
import type { Auth } from 'firebase-admin/auth';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { FIREBASE_AUTH } from '../../../../core/firebase/firebase.module.js';
import type { IAuthUser } from '../../../../common/interfaces/auth-user.interface.js';
import { FcmUserType } from '../../../../generated/prisma/enums.js';
import { ExternalServiceException } from '../../../../common/exceptions/external-service.exception.js';
import { handlePrismaError } from '../../../../common/utils/prisma-error.util.js';
import {
  AdminAccountInactiveException,
  AdminPhoneNotRegisteredException,
} from '../domain/errors/admin-auth.errors.js';

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(FIREBASE_AUTH) private readonly firebaseAuth: Auth,
  ) {}

  async verifyNumber(phoneNumber: string) {
    this.logger.log(`Verifying admin phone number ***${phoneNumber.slice(-4)}`);

    let admin: {
      id: number;
      fullName: string;
      role: string;
      isActive: boolean;
    } | null;

    try {
      admin = await this.prisma.appAdminStaff.findUnique({
        where: { phoneNumber },
        select: { id: true, fullName: true, role: true, isActive: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }

    if (!admin) {
      throw new AdminPhoneNotRegisteredException();
    }

    if (!admin.isActive) {
      throw new AdminAccountInactiveException();
    }

    return { fullName: admin.fullName, role: admin.role };
  }

  async login(user: IAuthUser, fcmToken: string) {
    this.logger.log(`Admin login adminId=${user.id}`);

    try {
      await this.upsertFcmToken(user.id, fcmToken, FcmUserType.admin);
    } catch (error) {
      handlePrismaError(error);
    }

    let admin: {
      id: number;
      fullName: string;
      email: string;
      phoneNumber: string;
      role: string;
      isActive: boolean;
      createdAt: Date;
    } | null;

    try {
      admin = await this.prisma.appAdminStaff.findUnique({
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
    } catch (error) {
      handlePrismaError(error);
    }

    this.logger.log(`Admin login successful adminId=${user.id}`);
    return admin!;
  }

  async logout(user: IAuthUser, fcmToken: string) {
    this.logger.log(`Admin logout adminId=${user.id}`);

    try {
      await this.firebaseAuth.revokeRefreshTokens(user.firebaseUid);
    } catch (error) {
      throw new ExternalServiceException('Firebase Auth', error);
    }

    try {
      await this.deactivateFcmToken(user.id, fcmToken, FcmUserType.admin);
    } catch (error) {
      handlePrismaError(error);
    }

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
