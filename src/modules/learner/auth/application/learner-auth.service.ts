import { Injectable, Inject, Logger } from '@nestjs/common';
import type { Auth } from 'firebase-admin/auth';
import { PrismaService } from '@/core/database/prisma.service.js';
import { FIREBASE_AUTH } from '@/core/firebase/firebase.module.js';
import type { IAuthUser, IFirebaseUser } from '@/common/interfaces/auth-user.interface.js';
import { FcmUserType } from '@/generated/prisma/enums.js';

@Injectable()
export class LearnerAuthService {
  private readonly logger = new Logger(LearnerAuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(FIREBASE_AUTH) private readonly firebaseAuth: Auth,
  ) {}

  async login(firebaseUser: IFirebaseUser, fcmToken: string) {
    this.logger.log('Learner login attempt', { phone: `***${firebaseUser.phone.slice(-4)}` });

    const phoneAsBigInt = BigInt(firebaseUser.phone);

    const learner = await this.prisma.$transaction(async (tx) => {
      let existing = await tx.learners.findUnique({
        where: { phoneNumber: phoneAsBigInt },
        select: { id: true, firstName: true, profileId: true, firebaseUid: true },
      });

      if (!existing) {
        // Auto-create learner on first login
        existing = await tx.learners.create({
          data: {
            phoneNumber: phoneAsBigInt,
            firstName: 'User',
            firebaseUid: firebaseUser.uid,
            termsAccepted: false,
          },
          select: { id: true, firstName: true, profileId: true, firebaseUid: true },
        });
        this.logger.log('New learner account created', { learnerId: existing.id });
      } else if (!existing.firebaseUid) {
        await tx.learners.update({
          where: { id: existing.id },
          data: { firebaseUid: firebaseUser.uid },
        });
      }

      return existing;
    });

    await this.upsertFcmToken(learner.id, fcmToken, FcmUserType.learner);

    this.logger.log('Learner login successful', { learnerId: learner.id });
    return {
      id: learner.id,
      phone: firebaseUser.phone,
      profileId: learner.profileId?.toString() ?? null,
    };
  }

  async logout(user: IAuthUser, fcmToken: string) {
    this.logger.log('Learner logout', { learnerId: user.id });

    await this.firebaseAuth.revokeRefreshTokens(user.firebaseUid);
    await this.deactivateFcmToken(user.id, fcmToken, FcmUserType.learner);

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
