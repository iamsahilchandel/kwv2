import {
  Controller, Get, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { AdminCentersService } from '../../application/admin-centers.service.js';
import { QueryCentersDto } from './dto/query-centers.dto.js';
import { UpdateCenterDto } from './dto/update-center.dto.js';
import { PaymentRejectDto } from './dto/payment-action.dto.js';

@ApiTags('Admin - Centers')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/centers')
export class AdminCentersController {
  constructor(private readonly service: AdminCentersService) {}

  @Get()
  findAll(@Query() query: QueryCentersDto) {
    return this.service.findAll(query);
  }

  @Get('listing')
  getListing() {
    return this.service.getListing();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCenterDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: IAuthUser) {
    return this.service.remove(id, user.id);
  }

  @Get(':id/check-center-head')
  checkCenterHead(@Param('id', ParseIntPipe) id: number) {
    return this.service.checkCenterHead(id);
  }

  @Patch(':id/payment/verify')
  verifyPayment(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: IAuthUser) {
    return this.service.verifyPayment(id, user.id);
  }

  @Patch(':id/payment/reject')
  rejectPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PaymentRejectDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.rejectPayment(id, dto, user.id);
  }

  @Get(':id/update-requests')
  getUpdateRequests(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUpdateRequests(id);
  }

  @Patch(':id/update-requests/:requestId/approve')
  approveUpdateRequest(
    @Param('id', ParseIntPipe) centerId: number,
    @Param('requestId', ParseIntPipe) requestId: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.approveUpdateRequest(centerId, requestId, user.id);
  }

  @Patch(':id/update-requests/:requestId/reject')
  rejectUpdateRequest(
    @Param('id', ParseIntPipe) centerId: number,
    @Param('requestId', ParseIntPipe) requestId: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.rejectUpdateRequest(centerId, requestId, user.id);
  }
}
