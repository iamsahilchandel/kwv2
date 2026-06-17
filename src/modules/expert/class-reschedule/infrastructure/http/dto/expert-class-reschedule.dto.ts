import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { RescheduleRequestStatus } from '../../../../../../generated/prisma/enums.js';

export const QueryRescheduleSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(RescheduleRequestStatus).optional(),
});

export type QueryRescheduleQuery = z.infer<typeof QueryRescheduleSchema>;

export const CreateRescheduleSchema = z.object({
  batchClassId: z.number().int().min(1),
  reason: z.string().min(1).max(1000),
  proposedSchedule: z.record(z.string(), z.unknown()).optional(),
});

export type CreateRescheduleBody = z.infer<typeof CreateRescheduleSchema>;

export class QueryRescheduleDto extends createZodDto(QueryRescheduleSchema) {}
export class CreateRescheduleDto extends createZodDto(CreateRescheduleSchema) {}
