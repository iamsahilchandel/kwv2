import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { EnrollmentStatus } from '../../../../../../generated/prisma/enums.js';

export const QueryEnrollmentsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  status: z.enum(EnrollmentStatus).optional(),
  batchId: z.coerce.number().int().optional(),
});

export type QueryEnrollmentsQuery = z.infer<typeof QueryEnrollmentsSchema>;

export const UpdateEnrollmentSchema = z.object({
  status: z.enum(EnrollmentStatus).optional(),
  notes: z.string().max(500).optional(),
});

export type UpdateEnrollmentBody = z.infer<typeof UpdateEnrollmentSchema>;

export class QueryEnrollmentsDto extends createZodDto(QueryEnrollmentsSchema) {}
export class UpdateEnrollmentDto extends createZodDto(UpdateEnrollmentSchema) {}
