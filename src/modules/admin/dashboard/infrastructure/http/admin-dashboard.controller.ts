import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { AdminDashboardService } from '../../application/admin-dashboard.service.js';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly service: AdminDashboardService) {}

  @Get('staff/role')
  getStaffRoleDistribution(@CurrentUser() user: IAuthUser) {
    return this.service.getStaffRoleDistribution(user.id);
  }

  @Get('center-by-services')
  getCentersByServices(@CurrentUser() user: IAuthUser) {
    return this.service.getCentersByServices(user.id);
  }

  @Get('center-by-services/:serviceId')
  getCentersByServiceId(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.getCentersByServiceId(serviceId, user.id);
  }

  @Get('inquiries')
  getInquiryStats(@CurrentUser() user: IAuthUser) {
    return this.service.getInquiryStats(user.id);
  }

  @Get('staff-metrics')
  getStaffMetrics(@CurrentUser() user: IAuthUser) {
    return this.service.getStaffMetrics(user.id);
  }

  @Get('staff')
  getStaffList(@CurrentUser() user: IAuthUser) {
    return this.service.getStaffList(user.id);
  }

  @Get('roles')
  getRolesStats(@CurrentUser() user: IAuthUser) {
    return this.service.getRolesStats(user.id);
  }

  @Get('growth')
  getStaffGrowth(@CurrentUser() user: IAuthUser) {
    return this.service.getStaffGrowth(user.id);
  }

  @Get('hierarchy')
  getHierarchyMetrics(@CurrentUser() user: IAuthUser) {
    return this.service.getHierarchyMetrics(user.id);
  }

  @Get('centers')
  getCenterMetrics(@CurrentUser() user: IAuthUser) {
    return this.service.getCenterMetrics(user.id);
  }

  @Get('centers/:id')
  getCenterById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.getCenterById(id, user.id);
  }
}
