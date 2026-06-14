import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BatchType } from '../../../../generated/prisma/enums.js';

@Injectable()
export class ExpertPicklistsService {
  private readonly logger = new Logger(ExpertPicklistsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getActivities(expertId: number) {
    this.logger.log('Fetching activities picklist for expert', { expertId });
    return this.prisma.expertExperties.findMany({
      where: { expertId },
      include: {
        service: { select: { id: true, serviceName: true, serviceGroup: true } },
      },
    });
  }

  async getBatchTypes() {
    return Object.values(BatchType);
  }

  async getCenters(expertId: number) {
    this.logger.log('Fetching centers picklist for expert', { expertId });
    return this.prisma.centerHasManyExperts.findMany({
      where: { expertId, isActive: true },
      select: {
        center: {
          select: {
            id: true,
            centerName: true,
            address: true,
          },
        },
      },
    });
  }
}
