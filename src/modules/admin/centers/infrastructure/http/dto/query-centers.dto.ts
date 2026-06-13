import { z } from 'zod';
import { PaginationQuerySchema } from '@/common/dto/pagination.dto.js';
import { CenterType, CenterOperatingEntity } from '@/generated/prisma/enums.js';

export const QueryCentersSchema = PaginationQuerySchema.extend({
  isActive: z
    .preprocess((v) => v === 'true' || v === true, z.boolean())
    .optional(),
  isVerified: z
    .preprocess((v) => v === 'true' || v === true, z.boolean())
    .optional(),
  centerType: z.enum(CenterType).optional(),
  operatingEntity: z.enum(CenterOperatingEntity).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export type QueryCentersQuery = z.infer<typeof QueryCentersSchema>;
