import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../database/prisma.service.js';
import { FcmUserType } from '../../generated/prisma/enums.js';

@Injectable()
export class LearnerAuthGuard implements CanActivate {
  private readonly logger = new Logger(LearnerAuthGuard.name);

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const firebaseUser = request.firebaseUser;

    if (!firebaseUser) {
      this.logger.warn('Learner guard: firebaseUser missing on request — FirebaseAuthGuard may not have run');
      throw new UnauthorizedException('Firebase token not verified');
    }

    const learner = await this.prisma.learners.findUnique({
      where: { phoneNumber: BigInt(firebaseUser.phone) },
      select: {
        id: true,
        phoneNumber: true,
        firebaseUid: true,
      },
    });

    if (!learner) {
      this.logger.warn('Learner not found for phone', {
        phone: firebaseUser.phone,
        uid: firebaseUser.uid,
        url: request.originalUrl,
      });
      throw new UnauthorizedException('Learner not found');
    }

    if (!learner.firebaseUid) {
      this.logger.log('Backfilling firebaseUid for learner', {
        learnerId: learner.id,
        uid: firebaseUser.uid,
      });
      await this.prisma.learners.update({
        where: { id: learner.id },
        data: { firebaseUid: firebaseUser.uid },
      });
    }

    request.user = {
      id: learner.id,
      phone: learner.phoneNumber.toString(),
      userType: FcmUserType.learner,
      role: null,
      firebaseUid: learner.firebaseUid ?? firebaseUser.uid,
      isActive: true,
    };

    return true;
  }
}
