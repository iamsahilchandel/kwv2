import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const QueryExpertLearnersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
});

export type QueryExpertLearnersQuery = z.infer<
  typeof QueryExpertLearnersSchema
>;

export class QueryExpertLearnersDto extends createZodDto(
  QueryExpertLearnersSchema,
) {}
