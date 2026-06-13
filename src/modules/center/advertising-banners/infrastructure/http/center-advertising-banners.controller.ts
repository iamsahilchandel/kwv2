import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '@/core/guards/center-staff-auth.guard.js';
import { CenterAdvertisingBannersService } from '../../application/center-advertising-banners.service.js';

@ApiTags('Center - Advertising Banners')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/advertising-banners')
export class CenterAdvertisingBannersController {
  constructor(private readonly service: CenterAdvertisingBannersService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
