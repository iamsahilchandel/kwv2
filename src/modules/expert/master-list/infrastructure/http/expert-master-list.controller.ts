import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExpertAuthGuard } from '../../../../../core/guards/expert-auth.guard.js';
import { ExpertMasterListService } from '../../application/expert-master-list.service.js';

@ApiTags('Expert - Master List')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/master-list')
export class ExpertMasterListController {
  constructor(private readonly service: ExpertMasterListService) {}

  @Get('amenities')
  getAmenities() {
    return this.service.getAmenities();
  }

  @Get('services')
  getServices() {
    return this.service.getServices();
  }
}
