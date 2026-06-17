import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const QueryAttendanceSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  batchId: z.coerce.number().int().positive().optional(),
  status: z.enum(['present', 'absent', 'late', 'excused']).optional(),
  startDate: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val))
    .optional(),
  endDate: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val))
    .optional(),
});

export type QueryAttendance = z.infer<typeof QueryAttendanceSchema>;

export class QueryAttendanceDto extends createZodDto(QueryAttendanceSchema) {}
