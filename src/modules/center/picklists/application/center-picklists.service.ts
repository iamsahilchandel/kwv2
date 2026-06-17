import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BatchType } from '../../../../generated/prisma/enums.js';

@Injectable()
export class CenterPicklistsService {
  private readonly logger = new Logger(CenterPicklistsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getActivities() {
    this.logger.log('Fetching activities picklist for center portal');
    return this.prisma.services.findMany({
      select: { id: true, serviceName: true, serviceGroup: true },
      orderBy: { serviceName: 'asc' },
    });
  }

  async getBatchTypes() {
    return Object.values(BatchType);
  }

  async getExperts(staffId: number) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Fetching experts picklist for center', { centerId });
    return this.prisma.centerHasManyExperts.findMany({
      where: { centerId, isActive: true },
      select: {
        expert: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            experties: {
              select: { service: { select: { id: true, serviceName: true } } },
            },
          },
        },
      },
    });
  }

  private async getCenterId(staffId: number): Promise<number> {
    const membership = await this.prisma.centerHasManyStaff.findFirst({
      where: { staffId, isActive: true, center: { isActive: true } },
      select: { centerId: true },
    });
    if (!membership)
      throw new UnauthorizedException('No active center found for staff');
    return membership.centerId;
  }
}
