import { z } from 'zod';
import { CouponType, CouponApplication } from '../../../../../../generated/prisma/enums.js';

export const CreateCouponSchema = z.object({
  code: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  type: z.enum(CouponType),
  value: z.number().min(0.01),
  minPurchaseAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  usageLimit: z.number().int().min(1).optional(),
  userUsageLimit: z.number().int().min(1).optional(),
  applicableTo: z.enum(CouponApplication),
  centerId: z.number().int().min(1).optional(),
  learnerId: z.number().int().min(1).optional(),
  expertId: z.number().int().min(1).optional(),
  batchId: z.number().int().min(1).optional(),
  isFirstPurchaseOnly: z.boolean().optional(),
});

export type CreateCouponBody = z.infer<typeof CreateCouponSchema>;
