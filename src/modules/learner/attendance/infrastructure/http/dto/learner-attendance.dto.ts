import { z } from 'zod';

export const QueryAttendanceSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  batchId: z.coerce.number().int().positive().optional(),
  status: z.enum(['present', 'absent', 'late', 'excused']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type QueryAttendanceDto = z.infer<typeof QueryAttendanceSchema>;
