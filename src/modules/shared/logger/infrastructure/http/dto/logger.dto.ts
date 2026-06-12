import { z } from 'zod';

export const LogsQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type LogsQuery = z.infer<typeof LogsQuerySchema>;
