import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';

@Injectable()
export class ExpertMasterListService {
  private readonly logger = new Logger(ExpertMasterListService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAmenities() {
    this.logger.log('Fetching amenities for expert portal');
    return this.prisma.ameneties.findMany({
      select: { id: true, amenityName: true },
      orderBy: { amenityName: 'asc' },
    });
  }

  async getServices() {
    this.logger.log('Fetching services for expert portal');
    return this.prisma.services.findMany({
      select: { id: true, serviceName: true, serviceGroup: true },
      orderBy: { serviceName: 'asc' },
    });
  }
}
