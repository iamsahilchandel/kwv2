import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '@/core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { CenterPaymentsService } from '../../application/center-payments.service.js';
import {
  QueryPaymentsSchema,
  type QueryPaymentsQuery,
  OnboardingPaymentSchema,
  type OnboardingPaymentBody,
  PayWithCouponSchema,
  type PayWithCouponBody,
} from './dto/center-payments.dto.js';

@ApiTags('Center - Payments')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/payments')
export class CenterPaymentsController {
  constructor(private readonly service: CenterPaymentsService) {}

  @Get()
  getHistory(
    @CurrentUser() user: IAuthUser,
    @Query(new ZodValidationPipe(QueryPaymentsSchema)) query: QueryPaymentsQuery,
  ) {
    return this.service.getHistory(user.id, query);
  }

  @Get('onboarding-amount')
  getOnboardingAmount(@CurrentUser() user: IAuthUser) {
    return this.service.getOnboardingAmount(user.id);
  }

  @Post('onboarding-payment')
  initiateOnboardingPayment(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(OnboardingPaymentSchema)) dto: OnboardingPaymentBody,
  ) {
    return this.service.initiateOnboardingPayment(user.id, dto);
  }

  @Post('pay-with-coupon')
  payWithCoupon(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(PayWithCouponSchema)) dto: PayWithCouponBody,
  ) {
    return this.service.payWithCoupon(user.id, dto);
  }
}
