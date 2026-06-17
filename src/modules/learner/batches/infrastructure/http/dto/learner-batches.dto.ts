import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const QueryBatchesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  status: z.enum(['active', 'completed', 'cancelled', 'upcoming']).optional(),
  batchType: z.enum(['fixed', 'ongoing', 'trial']).optional(),
  serviceId: z.coerce.number().int().positive().optional(),
  expertId: z.coerce.number().int().positive().optional(),
  startDateFrom: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val))
    .optional(),
  startDateTo: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val))
    .optional(),
});

export type QueryBatches = z.infer<typeof QueryBatchesSchema>;

export class QueryBatchesDto extends createZodDto(QueryBatchesSchema) {}
