import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '../../../../../core/guards/learner-auth.guard.js';
import { LearnerMasterListService } from '../../application/learner-master-list.service.js';

@ApiTags('Learner - Master List')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/master-list')
export class LearnerMasterListController {
  constructor(private readonly service: LearnerMasterListService) {}

  @Get('amenities')
  getAmenities() {
    return this.service.getAmenities();
  }

  @Get('services')
  getServices() {
    return this.service.getServices();
  }
}
