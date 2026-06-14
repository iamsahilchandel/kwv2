import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '../../../../../core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { CenterDashboardService } from '../../application/center-dashboard.service.js';

@ApiTags('Center - Dashboard')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/dashboard')
export class CenterDashboardController {
  constructor(private readonly service: CenterDashboardService) {}

  @Get('metrics')
  getMetrics(@CurrentUser() user: IAuthUser) {
    return this.service.getMetrics(user.id);
  }

  @Get('enrollment-metrics')
  getEnrollmentMetrics(@CurrentUser() user: IAuthUser) {
    return this.service.getEnrollmentMetrics(user.id);
  }

  @Get('revenue-metrics')
  getRevenueMetrics(@CurrentUser() user: IAuthUser) {
    return this.service.getRevenueMetrics(user.id);
  }
}
