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
export class ExpertAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const firebaseUser = request.firebaseUser;

    if (!firebaseUser) {
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
      throw new UnauthorizedException('Expert not found');
    }

    if (!expert.isActive) {
      throw new UnauthorizedException('Expert account is inactive');
    }

    if (!expert.firebaseUid) {
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
