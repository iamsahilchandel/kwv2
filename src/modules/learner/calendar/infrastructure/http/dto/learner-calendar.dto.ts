import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CalendarQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  centerId: z.coerce.number().int().positive().optional(),
  serviceId: z.coerce.number().int().positive().optional(),
  batchType: z.enum(['fixed', 'ongoing', 'trial']).optional(),
  status: z.enum(['active', 'completed', 'cancelled', 'upcoming']).optional(),
});

export type CalendarQuery = z.infer<typeof CalendarQuerySchema>;

export class CalendarQueryDto extends createZodDto(CalendarQuerySchema) {}
