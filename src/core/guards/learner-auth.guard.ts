import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../database/prisma.service.js';
import { FcmUserType } from '@/generated/prisma/enums.js';

@Injectable()
export class LearnerAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const firebaseUser = request.firebaseUser;

    if (!firebaseUser) {
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
      throw new UnauthorizedException('Learner not found');
    }

    if (!learner.firebaseUid) {
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
