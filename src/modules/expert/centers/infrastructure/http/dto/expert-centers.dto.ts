import { z } from 'zod';

export const QueryExpertCentersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
});

export type QueryExpertCentersQuery = z.infer<typeof QueryExpertCentersSchema>;
