import { z } from 'zod';
import { PaginationQuerySchema } from '@/common/dto/pagination.dto.js';
import { CouponStatus, CouponType, CouponApplication } from '@/generated/prisma/enums.js';

export const QueryCouponsSchema = PaginationQuerySchema.extend({
  status: z.nativeEnum(CouponStatus).optional(),
  type: z.nativeEnum(CouponType).optional(),
  applicableTo: z.nativeEnum(CouponApplication).optional(),
  centerId: z.coerce.number().int().min(1).optional(),
  batchId: z.coerce.number().int().min(1).optional(),
});

export type QueryCouponsQuery = z.infer<typeof QueryCouponsSchema>;
