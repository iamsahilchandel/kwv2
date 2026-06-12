import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { AdminCouponsService } from '../../application/admin-coupons.service.js';
import { CreateCouponSchema, type CreateCouponBody } from './dto/create-coupon.dto.js';
import { CreateCouponBatchSchema, type CreateCouponBatchBody } from './dto/create-coupon-batch.dto.js';
import { UpdateCouponSchema, type UpdateCouponBody } from './dto/update-coupon.dto.js';
import { QueryCouponsSchema, type QueryCouponsQuery } from './dto/query-coupons.dto.js';

@ApiTags('Admin - Coupons')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/coupons')
export class AdminCouponsController {
  constructor(private readonly service: AdminCouponsService) {}

  @Get('analytics')
  getAnalytics() {
    return this.service.getAnalytics();
  }

  @Get()
  findAll(@Query(new ZodValidationPipe(QueryCouponsSchema)) query: QueryCouponsQuery) {
    return this.service.findAll(query);
  }

  @Post()
  create(@Body(new ZodValidationPipe(CreateCouponSchema)) dto: CreateCouponBody, @CurrentUser() user: IAuthUser) {
    return this.service.create(dto, user.id);
  }

  @Post('batch')
  generateBatch(@Body(new ZodValidationPipe(CreateCouponBatchSchema)) dto: CreateCouponBatchBody, @CurrentUser() user: IAuthUser) {
    return this.service.generateBatch(dto, user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateCouponSchema)) dto: UpdateCouponBody,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.update(id, dto, user.id);
  }
}
