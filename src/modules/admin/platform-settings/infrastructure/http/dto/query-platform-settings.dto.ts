import { z } from 'zod';
import { PaginationQuerySchema } from '@/common/dto/pagination.dto.js';

export const QueryPlatformSettingsSchema = PaginationQuerySchema.extend({
  category: z.string().max(100).optional(),
  valueType: z.string().max(50).optional(),
});

export type QueryPlatformSettingsQuery = z.infer<
  typeof QueryPlatformSettingsSchema
>;
