import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '../../../../../core/guards/center-staff-auth.guard.js';
import { CenterMasterListService } from '../../application/center-master-list.service.js';

@ApiTags('Center - Master List')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/master-list')
export class CenterMasterListController {
  constructor(private readonly service: CenterMasterListService) {}

  @Get('amenities')
  getAmenities() {
    return this.service.getAmenities();
  }

  @Get('services')
  getServices() {
    return this.service.getServices();
  }
}
