import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
  paginationParams,
  buildPaginatedResult,
} from '../../../../common/utils/pagination.util.js';
import { AdvertisingBannerNotFoundException } from '../domain/errors/advertising-banner.errors.js';
import type { CreateAdvertisingBannerBody } from '../infrastructure/http/dto/create-advertising-banner.dto.js';
import type { UpdateAdvertisingBannerBody } from '../infrastructure/http/dto/update-advertising-banner.dto.js';
import type { QueryAdvertisingBannersQuery } from '../infrastructure/http/dto/query-advertising-banners.dto.js';

@Injectable()
export class AdminAdvertisingBannersService {
  private readonly logger = new Logger(AdminAdvertisingBannersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryAdvertisingBannersQuery) {
    const { skip, take, page, limit } = paginationParams(query);
    const { type, isActive, search } = query;

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.advertisingBanners.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.advertisingBanners.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async create(dto: CreateAdvertisingBannerBody, adminId: number) {
    this.logger.log('Creating advertising banner', {
      adminId,
      title: dto.title,
    });
    const banner = await this.prisma.advertisingBanners.create({ data: dto });
    this.logger.log('Advertising banner created', { bannerId: banner.id });
    return banner;
  }

  async update(id: number, dto: UpdateAdvertisingBannerBody) {
    const banner = await this.prisma.advertisingBanners.findUnique({
      where: { id },
    });
    if (!banner) throw new AdvertisingBannerNotFoundException(id);

    this.logger.log('Updating advertising banner', { bannerId: id });
    return this.prisma.advertisingBanners.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const banner = await this.prisma.advertisingBanners.findUnique({
      where: { id },
    });
    if (!banner) throw new AdvertisingBannerNotFoundException(id);

    await this.prisma.advertisingBanners.delete({ where: { id } });
    this.logger.log(`Advertising banner ${id} deleted`);
    return { message: 'Banner deleted successfully' };
  }
}
