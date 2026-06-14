import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../../../core/guards/admin-auth.guard.js';
import { AdminPicklistsService } from '../../application/admin-picklists.service.js';

@ApiTags('Admin - Picklists')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/picklists')
export class AdminPicklistsController {
  constructor(private readonly service: AdminPicklistsService) {}

  @Get('staff')
  @ApiQuery({ name: 'role', required: false })
  getStaffPicklist(@Query('role') role?: string) {
    return this.service.getStaffPicklist(role);
  }

  @Get('centers')
  @ApiQuery({ name: 'search', required: false })
  getCentersPicklist(@Query('search') search?: string) {
    return this.service.getCentersPicklist(search);
  }

  @Get('enums')
  getEnums() {
    return this.service.getEnums();
  }

  @Get('inquiry-cities')
  getInquiryCities() {
    return this.service.getInquiryCities();
  }

  @Get('inquiry-states')
  getInquiryStates() {
    return this.service.getInquiryStates();
  }

  @Get('center-cities')
  getCenterCities() {
    return this.service.getCenterCities();
  }

  @Get('center-states')
  getCenterStates() {
    return this.service.getCenterStates();
  }
}
