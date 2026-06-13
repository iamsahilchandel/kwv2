import { z } from 'zod';
import { AttendanceStatus } from '@/generated/prisma/enums.js';

export const MarkAttendanceSchema = z.object({
  attendances: z
    .array(
      z.object({
        learnerProfileId: z.number().int().min(1),
        batchEnrollmentId: z.number().int().min(1),
        attendanceStatus: z.enum(AttendanceStatus),
        notes: z.string().max(500).optional(),
      }),
    )
    .min(1),
});

export type MarkAttendanceBody = z.infer<typeof MarkAttendanceSchema>;
