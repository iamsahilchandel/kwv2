import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../../../core/guards/admin-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { AdminCentersService } from '../../application/admin-centers.service.js';
import {
  QueryCentersSchema,
  type QueryCentersQuery,
} from './dto/query-centers.dto.js';
import {
  UpdateCenterSchema,
  type UpdateCenterBody,
} from './dto/update-center.dto.js';
import {
  PaymentRejectSchema,
  type PaymentRejectBody,
} from './dto/payment-action.dto.js';

@ApiTags('Admin - Centers')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/centers')
export class AdminCentersController {
  constructor(private readonly service: AdminCentersService) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(QueryCentersSchema)) query: QueryCentersQuery,
  ) {
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
    @Body(new ZodValidationPipe(UpdateCenterSchema)) dto: UpdateCenterBody,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.remove(id, user.id);
  }

  @Get(':id/check-center-head')
  checkCenterHead(@Param('id', ParseIntPipe) id: number) {
    return this.service.checkCenterHead(id);
  }

  @Patch(':id/payment/verify')
  verifyPayment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.verifyPayment(id, user.id);
  }

  @Patch(':id/payment/reject')
  rejectPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(PaymentRejectSchema)) dto: PaymentRejectBody,
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
