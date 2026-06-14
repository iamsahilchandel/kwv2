import { z } from 'zod';
import { PaginationQuerySchema } from '../../../../../../common/dto/pagination.dto.js';
import {
  CouponStatus,
  CouponType,
  CouponApplication,
} from '../../../../../../generated/prisma/enums.js';

export const QueryCouponsSchema = PaginationQuerySchema.extend({
  status: z.enum(CouponStatus).optional(),
  type: z.enum(CouponType).optional(),
  applicableTo: z.enum(CouponApplication).optional(),
  centerId: z.coerce.number().int().min(1).optional(),
  batchId: z.coerce.number().int().min(1).optional(),
});

export type QueryCouponsQuery = z.infer<typeof QueryCouponsSchema>;
