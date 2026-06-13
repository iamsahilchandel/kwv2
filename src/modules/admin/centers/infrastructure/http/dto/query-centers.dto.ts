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
  centerType: z.nativeEnum(CenterType).optional(),
  operatingEntity: z.nativeEnum(CenterOperatingEntity).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export type QueryCentersQuery = z.infer<typeof QueryCentersSchema>;
