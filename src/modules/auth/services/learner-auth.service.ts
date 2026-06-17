import { Injectable, Inject, Logger } from '@nestjs/common';
import type { Auth } from 'firebase-admin/auth';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { FIREBASE_AUTH } from '../../../core/firebase/firebase.module.js';
import type {
  IAuthUser,
  IFirebaseUser,
} from '../../../common/interfaces/auth-user.interface.js';
import { FcmUserType } from '../../../generated/prisma/enums.js';

@Injectable()
export class LearnerAuthService {
  private readonly logger = new Logger(LearnerAuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(FIREBASE_AUTH) private readonly firebaseAuth: Auth,
  ) {}

  async login(firebaseUser: IFirebaseUser, fcmToken?: string | null) {
    const phoneAsBigInt = BigInt(firebaseUser.phone);

    const learner = await this.prisma.$transaction(async (tx) => {
      let existing = await tx.learners.findUnique({
        where: { phoneNumber: phoneAsBigInt },
        select: {
          id: true,
          firstName: true,
          profileId: true,
          firebaseUid: true,
        },
      });

      if (!existing) {
        existing = await tx.learners.create({
          data: {
            phoneNumber: phoneAsBigInt,
            firstName: 'User',
            firebaseUid: firebaseUser.uid,
            termsAccepted: false,
          },
          select: {
            id: true,
            firstName: true,
            profileId: true,
            firebaseUid: true,
          },
        });
      } else if (!existing.firebaseUid) {
        await tx.learners.update({
          where: { id: existing.id },
          data: { firebaseUid: firebaseUser.uid },
        });
      }

      return existing;
    });

    if (fcmToken)
      await this.upsertFcmToken(learner.id, fcmToken, FcmUserType.learner);

    return {
      id: learner.id,
      phone: firebaseUser.phone,
      profileId: learner.profileId?.toString() ?? null,
    };
  }

  async logout(user: IAuthUser, fcmToken?: string | null) {
    try {
      await this.firebaseAuth.revokeRefreshTokens(user.firebaseUid);
      this.logger.log('Learner refresh tokens revoked', {
        learnerId: user.id,
        uid: user.firebaseUid,
      });
    } catch (err: unknown) {
      const e = err as {
        errorInfo?: { code?: string; message?: string };
        code?: string;
        message?: string;
      };
      this.logger.error('Failed to revoke learner refresh tokens', {
        learnerId: user.id,
        uid: user.firebaseUid,
        code: e?.errorInfo?.code ?? e?.code ?? 'unknown',
        message: e?.errorInfo?.message ?? e?.message ?? 'No message',
      });
      throw err;
    }
    if (fcmToken)
      await this.deactivateFcmToken(user.id, fcmToken, FcmUserType.learner);
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
