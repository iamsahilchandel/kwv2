import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';

@Injectable()
export class LearnerMasterListService {
  private readonly logger = new Logger(LearnerMasterListService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAmenities() {
    this.logger.debug('Fetching amenities');
    return this.prisma.ameneties.findMany({ orderBy: { amenityName: 'asc' } });
  }

  async getServices() {
    this.logger.debug('Fetching services');
    return this.prisma.services.findMany({ orderBy: { serviceName: 'asc' } });
  }
}
