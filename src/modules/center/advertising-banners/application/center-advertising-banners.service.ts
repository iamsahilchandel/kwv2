import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BannerType } from '../../../../generated/prisma/enums.js';

@Injectable()
export class CenterAdvertisingBannersService {
  private readonly logger = new Logger(CenterAdvertisingBannersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.logger.log('Fetching advertising banners for center portal');
    return this.prisma.advertisingBanners.findMany({
      where: {
        isActive: true,
        type: { in: [BannerType.center, BannerType.all] },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
