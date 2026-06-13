import { z } from 'zod';
import { CouponStatus } from '@/generated/prisma/enums.js';

export const UpdateCouponSchema = z.object({
  description: z.string().max(500).optional(),
  minPurchaseAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  status: z.enum(CouponStatus).optional(),
  usageLimit: z.number().int().min(1).optional(),
  userUsageLimit: z.number().int().min(1).optional(),
  isFirstPurchaseOnly: z.boolean().optional(),
});

export type UpdateCouponBody = z.infer<typeof UpdateCouponSchema>;
