import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '@/core/guards/learner-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { LearnerPicklistsService } from '../../application/learner-picklists.service.js';

@ApiTags('Learner - Picklists')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/picklists')
export class LearnerPicklistsController {
  constructor(private readonly service: LearnerPicklistsService) {}

  @Get('activities')
  getActivities(@CurrentUser() user: IAuthUser) {
    return this.service.getActivities(user.id);
  }

  @Get('centers')
  getCenters(@CurrentUser() user: IAuthUser) {
    return this.service.getCenters(user.id);
  }

  @Get('batch-types')
  getBatchTypes(@CurrentUser() user: IAuthUser) {
    return this.service.getBatchTypes(user.id);
  }

  @Get('experts')
  getExperts(@CurrentUser() user: IAuthUser) {
    return this.service.getExperts(user.id);
  }
}
