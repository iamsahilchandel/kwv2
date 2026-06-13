import { z } from 'zod';

export const CalendarQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export type CalendarQuery = z.infer<typeof CalendarQuerySchema>;

export const UpcomingClassesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type UpcomingClassesQuery = z.infer<typeof UpcomingClassesQuerySchema>;
