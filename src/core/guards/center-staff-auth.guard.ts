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
export class CenterStaffAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const firebaseUser = request.firebaseUser;

    if (!firebaseUser) {
      throw new UnauthorizedException('Firebase token not verified');
    }

    const staff = await this.prisma.centerStaff.findUnique({
      where: { phoneNumber: firebaseUser.phone },
      select: {
        id: true,
        phoneNumber: true,
        firebaseUid: true,
        isActive: true,
        staffMemberships: {
          where: { center: { isActive: true } },
          select: { role: true, centerId: true },
          take: 1,
        },
      },
    });

    if (!staff) {
      throw new UnauthorizedException('Center staff not found');
    }

    if (!staff.isActive) {
      throw new UnauthorizedException('Center staff account is inactive');
    }

    if (staff.staffMemberships.length === 0) {
      throw new UnauthorizedException('No active center assignment found');
    }

    if (!staff.firebaseUid) {
      await this.prisma.centerStaff.update({
        where: { id: staff.id },
        data: { firebaseUid: firebaseUser.uid },
      });
    }

    const primaryRole = staff.staffMemberships[0].role;

    request.user = {
      id: staff.id,
      phone: staff.phoneNumber,
      userType: FcmUserType.center,
      role: primaryRole,
      firebaseUid: staff.firebaseUid ?? firebaseUser.uid,
      isActive: staff.isActive,
    };

    return true;
  }
}
