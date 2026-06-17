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
export class AdminAuthGuard implements CanActivate {
  private readonly logger = new Logger(AdminAuthGuard.name);

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const firebaseUser = request.firebaseUser;

    if (!firebaseUser) {
      this.logger.warn('Admin guard: firebaseUser missing on request — FirebaseAuthGuard may not have run');
      throw new UnauthorizedException('Firebase token not verified');
    }

    const admin = await this.prisma.appAdminStaff.findUnique({
      where: { phoneNumber: firebaseUser.phone },
      select: {
        id: true,
        phoneNumber: true,
        firebaseUid: true,
        role: true,
        isActive: true,
      },
    });

    if (!admin) {
      this.logger.warn('Admin not found for phone', {
        phone: firebaseUser.phone,
        uid: firebaseUser.uid,
        url: request.originalUrl,
      });
      throw new UnauthorizedException('Admin not found');
    }

    if (!admin.isActive) {
      this.logger.warn('Admin account is inactive', {
        adminId: admin.id,
        phone: firebaseUser.phone,
        url: request.originalUrl,
      });
      throw new UnauthorizedException('Admin account is inactive');
    }

    if (!admin.firebaseUid) {
      this.logger.log('Backfilling firebaseUid for admin', {
        adminId: admin.id,
        uid: firebaseUser.uid,
      });
      await this.prisma.appAdminStaff.update({
        where: { id: admin.id },
        data: { firebaseUid: firebaseUser.uid },
      });
    }

    request.user = {
      id: admin.id,
      phone: admin.phoneNumber,
      userType: FcmUserType.admin,
      role: admin.role,
      firebaseUid: admin.firebaseUid ?? firebaseUser.uid,
      isActive: admin.isActive,
    };

    return true;
  }
}
