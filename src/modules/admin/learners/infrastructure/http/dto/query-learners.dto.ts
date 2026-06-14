import { z } from 'zod';
import { PaginationQuerySchema } from '../../../../../../common/dto/pagination.dto.js';

export const QueryLearnersSchema = PaginationQuerySchema.extend({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type QueryLearnersQuery = z.infer<typeof QueryLearnersSchema>;
