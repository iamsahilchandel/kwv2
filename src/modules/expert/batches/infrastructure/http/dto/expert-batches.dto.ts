import { z } from 'zod';
import { BatchStatus, BatchType } from '../../../../../../generated/prisma/enums.js';

export const QueryExpertBatchesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  status: z.enum(BatchStatus).optional(),
  batchType: z.enum(BatchType).optional(),
});

export type QueryExpertBatchesQuery = z.infer<typeof QueryExpertBatchesSchema>;
