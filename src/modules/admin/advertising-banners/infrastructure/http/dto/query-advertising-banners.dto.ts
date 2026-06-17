import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../../../../common/dto/pagination.dto.js';
import { BannerType } from './create-advertising-banner.dto.js';

export const QueryAdvertisingBannersSchema = PaginationQuerySchema.extend({
  type: z.enum(BannerType).optional(),
  isActive: z
    .preprocess((v) => v === 'true' || v === true, z.boolean())
    .optional(),
});

export type QueryAdvertisingBannersQuery = z.infer<
  typeof QueryAdvertisingBannersSchema
>;

export class QueryAdvertisingBannersDto extends createZodDto(
  QueryAdvertisingBannersSchema,
) {}
