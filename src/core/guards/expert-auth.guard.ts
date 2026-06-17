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
export class ExpertAuthGuard implements CanActivate {
  private readonly logger = new Logger(ExpertAuthGuard.name);

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const firebaseUser = request.firebaseUser;

    if (!firebaseUser) {
      this.logger.warn('Expert guard: firebaseUser missing on request — FirebaseAuthGuard may not have run');
      throw new UnauthorizedException('Firebase token not verified');
    }

    const expert = await this.prisma.experts.findUnique({
      where: { phoneNumber: firebaseUser.phone },
      select: {
        id: true,
        phoneNumber: true,
        firebaseUid: true,
        isActive: true,
      },
    });

    if (!expert) {
      this.logger.warn('Expert not found for phone', {
        phone: firebaseUser.phone,
        uid: firebaseUser.uid,
        url: request.originalUrl,
      });
      throw new UnauthorizedException('Expert not found');
    }

    if (!expert.isActive) {
      this.logger.warn('Expert account is inactive', {
        expertId: expert.id,
        phone: firebaseUser.phone,
        url: request.originalUrl,
      });
      throw new UnauthorizedException('Expert account is inactive');
    }

    if (!expert.firebaseUid) {
      this.logger.log('Backfilling firebaseUid for expert', {
        expertId: expert.id,
        uid: firebaseUser.uid,
      });
      await this.prisma.experts.update({
        where: { id: expert.id },
        data: { firebaseUid: firebaseUser.uid },
      });
    }

    request.user = {
      id: expert.id,
      phone: expert.phoneNumber ?? firebaseUser.phone,
      userType: FcmUserType.expert,
      role: null,
      firebaseUid: expert.firebaseUid ?? firebaseUser.uid,
      isActive: expert.isActive,
    };

    return true;
  }
}
