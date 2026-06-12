import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import type { QueryPlatformSettingsDto } from '../infrastructure/http/dto/query-platform-settings.dto.js';
import type { UpdatePlatformSettingsDto } from '../infrastructure/http/dto/update-platform-settings.dto.js';
import { SettingValueType } from '@/generated/prisma/enums.js';

@Injectable()
export class AdminPlatformSettingsService {
  private readonly logger = new Logger(AdminPlatformSettingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryPlatformSettingsDto) {
    const { skip, take, page, limit } = paginationParams(query);
    const { category, search, valueType } = query;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (valueType) where.valueType = valueType;
    if (search) {
      where.OR = [
        { keyName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.platformSettings.findMany({
        where,
        skip,
        take,
        orderBy: [{ category: 'asc' }, { sequence: 'asc' }],
      }),
      this.prisma.platformSettings.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async findOne(id: number) {
    const setting = await this.prisma.platformSettings.findUnique({ where: { id } });
    if (!setting) throw new NotFoundException(`Platform setting with id ${id} not found`);
    return setting;
  }

  async update(id: number, dto: UpdatePlatformSettingsDto, adminId: number) {
    const setting = await this.prisma.platformSettings.findUnique({ where: { id } });
    if (!setting) throw new NotFoundException(`Platform setting with id ${id} not found`);

    this.logger.log('Updating platform setting', { settingId: id, adminId });

    // Map the string value to the correct typed column
    const valueUpdate = this.buildValueUpdate(setting.valueType, dto.value);

    const updated = await this.prisma.platformSettings.update({
      where: { id },
      data: { ...valueUpdate, description: dto.description ?? setting.description, updatedBy: adminId },
    });

    this.logger.log('Platform setting updated', { settingId: id });
    return updated;
  }

  private buildValueUpdate(valueType: SettingValueType, raw: string) {
    switch (valueType) {
      case SettingValueType.string:
        return { stringValue: raw };
      case SettingValueType.number:
        return { numberValue: parseFloat(raw) };
      case SettingValueType.boolean:
        return { booleanValue: raw === 'true' };
      case SettingValueType.json:
        return { jsonValue: JSON.parse(raw) };
      case SettingValueType.datetime:
        return { datetimeValue: new Date(raw) };
      default:
        return { stringValue: raw };
    }
  }
}
