import { z } from 'zod';
import { BatchType, BatchStatus, AttendanceStatus, BenefitType } from '../../../../../../generated/prisma/enums.js';

export const CreateBatchSchema = z.object({
  batchName: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  batchType: z.enum(BatchType),
  expertId: z.number().int().min(1),
  serviceId: z.number().int().min(1),
  venue: z.string().max(200).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  frequency: z.record(z.string(), z.unknown()),
  numberOfClasses: z.number().int().min(1).optional(),
  expertPayPerClass: z.number().positive().optional(),
  basePrice: z.number().min(0),
  allowMidTermJoining: z.boolean().default(false),
  requireExpertConfirmation: z.boolean().default(true),
  minimumClassesBooking: z.number().int().min(1).default(1),
  numberOfSeats: z.number().int().min(1).optional(),
  benefits: z.array(
    z.object({
      benefitTitle: z.string().min(1),
      benefitDescription: z.string().optional(),
      benefitType: z.enum(BenefitType).default('other'),
    }),
  ).optional(),
});

export type CreateBatchBody = z.infer<typeof CreateBatchSchema>;

export const UpdateBatchSchema = z.object({
  batchName: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  venue: z.string().max(200).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  frequency: z.record(z.string(), z.unknown()).optional(),
  numberOfClasses: z.number().int().min(1).optional(),
  expertPayPerClass: z.number().positive().optional(),
  basePrice: z.number().min(0).optional(),
  allowMidTermJoining: z.boolean().optional(),
  requireExpertConfirmation: z.boolean().optional(),
  minimumClassesBooking: z.number().int().min(1).optional(),
  numberOfSeats: z.number().int().min(1).optional(),
  expertId: z.number().int().min(1).optional(),
});

export type UpdateBatchBody = z.infer<typeof UpdateBatchSchema>;

export const QueryBatchesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  status: z.enum(BatchStatus).optional(),
  batchType: z.enum(BatchType).optional(),
  expertId: z.coerce.number().int().optional(),
  serviceId: z.coerce.number().int().optional(),
  startDateFrom: z.coerce.date().optional(),
  startDateTo: z.coerce.date().optional(),
});

export type QueryBatchesQuery = z.infer<typeof QueryBatchesSchema>;

export const MarkAttendanceSchema = z.object({
  attendances: z.array(
    z.object({
      learnerProfileId: z.number().int().min(1),
      batchEnrollmentId: z.number().int().min(1),
      attendanceStatus: z.enum(AttendanceStatus),
      notes: z.string().max(500).optional(),
    }),
  ).min(1),
});

export type MarkAttendanceBody = z.infer<typeof MarkAttendanceSchema>;
