import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const LogsQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type LogsQuery = z.infer<typeof LogsQuerySchema>;

export class LogsQueryDto extends createZodDto(LogsQuerySchema) {}
