import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { BannerType } from '@/generated/prisma/enums.js';

@Injectable()
export class ExpertAdvertisingBannersService {
  private readonly logger = new Logger(ExpertAdvertisingBannersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(expertId: number) {
    this.logger.log('Fetching advertising banners for expert portal', { expertId });
    return this.prisma.advertisingBanners.findMany({
      where: {
        isActive: true,
        type: { in: [BannerType.expert, BannerType.all] },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
