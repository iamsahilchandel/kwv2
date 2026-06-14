import { z } from 'zod';
import { CenterPaymentMethod } from '../../../../../../generated/prisma/enums.js';

export const QueryPaymentsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
});

export type QueryPaymentsQuery = z.infer<typeof QueryPaymentsSchema>;

export const OnboardingPaymentSchema = z.object({
  paymentMethod: z.enum(CenterPaymentMethod),
  returnUrl: z.url().optional(),
  notifyUrl: z.url().optional(),
});

export type OnboardingPaymentBody = z.infer<typeof OnboardingPaymentSchema>;

export const PayWithCouponSchema = z.object({
  couponCode: z.string().min(1).max(50),
});

export type PayWithCouponBody = z.infer<typeof PayWithCouponSchema>;
