import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';

@Injectable()
export class CenterMasterListService {
  private readonly logger = new Logger(CenterMasterListService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAmenities() {
    this.logger.log('Fetching amenities for center portal');
    return this.prisma.ameneties.findMany({
      select: { id: true, amenityName: true, description: true },
      orderBy: { amenityName: 'asc' },
    });
  }

  async getServices() {
    this.logger.log('Fetching services for center portal');
    return this.prisma.services.findMany({
      select: {
        id: true,
        serviceName: true,
        serviceGroup: true,
        description: true,
      },
      orderBy: { serviceName: 'asc' },
    });
  }
}
