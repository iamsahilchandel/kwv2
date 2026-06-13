import { z } from 'zod';

export const CreateEnrollmentSchema = z.object({
  batchId: z.number().int().positive(),
  classesBooked: z.number().int().positive().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  couponCode: z.string().max(50).optional(),
  paymentMethod: z.string().max(50).default('gateway'),
});

export type CreateEnrollmentDto = z.infer<typeof CreateEnrollmentSchema>;

export const QueryEnrollmentsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['pending', 'enrolled', 'cancelled', 'completed', 'rejected']).optional(),
  batchId: z.coerce.number().int().positive().optional(),
});

export type QueryEnrollmentsDto = z.infer<typeof QueryEnrollmentsSchema>;

export const VerifyPaymentSchema = z.object({
  enrollmentId: z.number().int().positive(),
  orderId: z.string().min(1),
});

export type VerifyPaymentDto = z.infer<typeof VerifyPaymentSchema>;
