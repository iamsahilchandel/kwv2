import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateEnrollmentSchema = z.object({
  batchId: z.number().int().positive(),
  classesBooked: z.number().int().positive().optional(),
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
  couponCode: z.string().max(50).optional(),
  paymentMethod: z.string().max(50).default('gateway'),
});

export type CreateEnrollment = z.infer<typeof CreateEnrollmentSchema>;

export const QueryEnrollmentsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z
    .enum(['pending', 'enrolled', 'cancelled', 'completed', 'rejected'])
    .optional(),
  batchId: z.coerce.number().int().positive().optional(),
});

export type QueryEnrollments = z.infer<typeof QueryEnrollmentsSchema>;

export const VerifyPaymentSchema = z.object({
  enrollmentId: z.number().int().positive(),
  orderId: z.string().min(1),
});

export type VerifyPayment = z.infer<typeof VerifyPaymentSchema>;

export class CreateEnrollmentDto extends createZodDto(CreateEnrollmentSchema) {}
export class QueryEnrollmentsDto extends createZodDto(QueryEnrollmentsSchema) {}
export class VerifyPaymentDto extends createZodDto(VerifyPaymentSchema) {}
