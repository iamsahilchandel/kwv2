import { Injectable, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service.js';
import { paginationParams, buildPaginatedResult } from '@/common/utils/pagination.util.js';
import { BusinessRuleException } from '@/common/exceptions/business-rule.exception.js';
import type { QueryPaymentsQuery, OnboardingPaymentBody, PayWithCouponBody } from '../infrastructure/http/dto/center-payments.dto.js';

@Injectable()
export class CenterPaymentsService {
  private readonly logger = new Logger(CenterPaymentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getHistory(staffId: number, query: QueryPaymentsQuery) {
    const centerId = await this.getCenterId(staffId);
    const { skip, take, page, limit } = paginationParams(query);
    const { status } = query;

    const where: Record<string, unknown> = { centerId, paymentType: 'center_onboarding' };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { transactions: true },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return buildPaginatedResult(items, total, page, limit);
  }

  async getOnboardingAmount(staffId: number) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Fetching onboarding payment amount', { centerId });

    const center = await this.prisma.center.findUnique({
      where: { id: centerId },
      select: {
        id: true,
        isOnboardingPaymentReceived: true,
        isOnboardingPaymentVerified: true,
        onboardingPaymentAmount: true,
        originalOnboardingAmount: true,
        subscriptionAmount: true,
      },
    });

    if (!center) throw new NotFoundException('Center not found');

    const platformFeeSetting = await this.prisma.platformSettings.findFirst({
      where: { category: 'payment', keyName: 'center_onboarding_fee' },
    });

    const baseAmount = platformFeeSetting?.numberValue ?? center.originalOnboardingAmount ?? 0;

    return {
      centerId,
      baseAmount,
      isAlreadyPaid: center.isOnboardingPaymentReceived,
      isVerified: center.isOnboardingPaymentVerified,
      currentPaymentAmount: center.onboardingPaymentAmount,
    };
  }

  async initiateOnboardingPayment(staffId: number, dto: OnboardingPaymentBody) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Initiating onboarding payment', { centerId, method: dto.paymentMethod });

    const center = await this.prisma.center.findUnique({
      where: { id: centerId },
      select: { isOnboardingPaymentVerified: true, originalOnboardingAmount: true },
    });

    if (!center) throw new NotFoundException('Center not found');
    if (center.isOnboardingPaymentVerified) {
      throw new BusinessRuleException('Onboarding payment is already verified');
    }

    const orderId = `center_onboard_${centerId}_${Date.now()}`;
    const baseAmount = center.originalOnboardingAmount ?? 0;

    const payment = await this.prisma.payment.create({
      data: {
        paymentType: 'center_onboarding',
        centerId,
        orderId,
        baseAmount,
        totalAmount: baseAmount,
        amount: baseAmount,
        currency: 'INR',
        paymentMethod: dto.paymentMethod,
        status: 'pending',
      },
    });

    this.logger.log('Onboarding payment initiated', { centerId, orderId: payment.orderId });
    return payment;
  }

  async payWithCoupon(staffId: number, dto: PayWithCouponBody) {
    const centerId = await this.getCenterId(staffId);
    this.logger.log('Applying coupon for center onboarding', { centerId, couponCode: dto.couponCode });

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: dto.couponCode },
    });

    if (!coupon) throw new NotFoundException(`Coupon ${dto.couponCode} not found`);
    if (coupon.status !== 'active') {
      throw new BusinessRuleException('Coupon is not active', { couponCode: dto.couponCode, status: coupon.status });
    }
    if (coupon.endDate < new Date()) {
      throw new BusinessRuleException('Coupon has expired');
    }

    const center = await this.prisma.center.findUnique({
      where: { id: centerId },
      select: { isOnboardingPaymentVerified: true, originalOnboardingAmount: true },
    });

    if (!center) throw new NotFoundException('Center not found');
    if (center.isOnboardingPaymentVerified) {
      throw new BusinessRuleException('Onboarding payment is already verified');
    }

    const baseAmount = Number(center.originalOnboardingAmount ?? 0);
    let discountAmount = 0;

    if (coupon.type === 'percentage') {
      discountAmount = (baseAmount * Number(coupon.value)) / 100;
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
      }
    } else {
      discountAmount = Number(coupon.value);
    }

    const finalAmount = Math.max(0, baseAmount - discountAmount);
    const isFullPayment = finalAmount === 0;

    const orderId = `center_coupon_${centerId}_${Date.now()}`;

    const [payment] = await this.prisma.$transaction([
      this.prisma.payment.create({
        data: {
          paymentType: 'center_onboarding',
          centerId,
          orderId,
          baseAmount,
          discount: discountAmount,
          totalAmount: finalAmount,
          amount: finalAmount,
          currency: 'INR',
          paymentMethod: 'coupon',
          status: isFullPayment ? 'successful' : 'pending',
          paymentDate: isFullPayment ? new Date() : null,
        },
      }),
      this.prisma.couponRedemption.create({
        data: {
          couponId: coupon.id,
          centerId,
          discountAmount,
          originalAmount: baseAmount,
          finalAmount,
          isFullPayment,
          module: 'center_payment',
        },
      }),
    ]);

    if (isFullPayment) {
      await this.prisma.center.update({
        where: { id: centerId },
        data: {
          isOnboardingPaymentReceived: true,
          onboardingPaymentMethod: 'coupon',
          onboardingPaymentAmount: finalAmount,
          coupon: dto.couponCode,
          couponAppliedOn: new Date(),
          onboardingPaymentReceivedOn: new Date(),
        },
      });
      this.logger.log('Coupon covered full onboarding payment', { centerId });
    }

    return { payment, discountAmount, finalAmount, isFullPayment };
  }

  private async getCenterId(staffId: number): Promise<number> {
    const membership = await this.prisma.centerHasManyStaff.findFirst({
      where: { staffId, isActive: true, center: { isActive: true } },
      select: { centerId: true },
    });
    if (!membership) throw new UnauthorizedException('No active center found for staff');
    return membership.centerId;
  }
}
