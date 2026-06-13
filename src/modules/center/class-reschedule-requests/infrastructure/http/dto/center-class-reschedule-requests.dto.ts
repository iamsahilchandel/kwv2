import { z } from 'zod';
import { RescheduleRequestStatus, RequesterType } from '@/generated/prisma/enums.js';

export const QueryRescheduleRequestsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(RescheduleRequestStatus).optional(),
  requesterType: z.enum(RequesterType).optional(),
});

export type QueryRescheduleRequestsQuery = z.infer<typeof QueryRescheduleRequestsSchema>;

export const ApproveRescheduleSchema = z.object({
  proposedSchedule: z.object({
    classDate: z.coerce.date(),
    startTime: z.string(),
    endTime: z.string(),
  }).optional(),
  adminNotes: z.string().max(500).optional(),
});

export type ApproveRescheduleBody = z.infer<typeof ApproveRescheduleSchema>;

export const RejectRescheduleSchema = z.object({
  adminNotes: z.string().min(1).max(500),
});

export type RejectRescheduleBody = z.infer<typeof RejectRescheduleSchema>;
