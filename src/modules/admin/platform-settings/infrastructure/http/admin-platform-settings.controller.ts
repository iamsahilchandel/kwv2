import { Controller, Get, Patch, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { AdminPlatformSettingsService } from '../../application/admin-platform-settings.service.js';
import { QueryPlatformSettingsDto } from './dto/query-platform-settings.dto.js';
import { UpdatePlatformSettingsDto } from './dto/update-platform-settings.dto.js';

@ApiTags('Admin - Platform Settings')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/platform-settings')
export class AdminPlatformSettingsController {
  constructor(private readonly service: AdminPlatformSettingsService) {}

  @Get()
  findAll(@Query() query: QueryPlatformSettingsDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlatformSettingsDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.update(id, dto, user.id);
  }
}
