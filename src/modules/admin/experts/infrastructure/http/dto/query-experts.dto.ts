import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { PaginationQuerySchema } from '../../../../../../common/dto/pagination.dto.js';

export const QueryExpertsSchema = PaginationQuerySchema.extend({
  tab: z.string().optional(),
  isActive: z
    .preprocess((v) => v === 'true' || v === true, z.boolean())
    .optional(),
  isVerified: z
    .preprocess((v) => v === 'true' || v === true, z.boolean())
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type QueryExpertsQuery = z.infer<typeof QueryExpertsSchema>;

export class QueryExpertsDto extends createZodDto(QueryExpertsSchema) {}
