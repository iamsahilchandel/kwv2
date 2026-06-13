import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExpertAuthGuard } from '@/core/guards/expert-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { ExpertPicklistsService } from '../../application/expert-picklists.service.js';

@ApiTags('Expert - Picklists')
@ApiBearerAuth()
@UseGuards(ExpertAuthGuard)
@Controller('expert/picklists')
export class ExpertPicklistsController {
  constructor(private readonly service: ExpertPicklistsService) {}

  @Get('activities')
  getActivities(@CurrentUser() user: IAuthUser) {
    return this.service.getActivities(user.id);
  }

  @Get('batch-types')
  getBatchTypes() {
    return this.service.getBatchTypes();
  }

  @Get('centers')
  getCenters(@CurrentUser() user: IAuthUser) {
    return this.service.getCenters(user.id);
  }
}
