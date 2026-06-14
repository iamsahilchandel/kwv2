import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '../../../../../core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { CenterPicklistsService } from '../../application/center-picklists.service.js';

@ApiTags('Center - Picklists')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/picklists')
export class CenterPicklistsController {
  constructor(private readonly service: CenterPicklistsService) {}

  @Get('activities')
  getActivities() {
    return this.service.getActivities();
  }

  @Get('batch-types')
  getBatchTypes() {
    return this.service.getBatchTypes();
  }

  @Get('experts')
  getExperts(@CurrentUser() user: IAuthUser) {
    return this.service.getExperts(user.id);
  }
}
