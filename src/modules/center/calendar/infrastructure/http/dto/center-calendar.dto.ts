import { z } from 'zod';
import { ClassType } from '../../../../../../generated/prisma/enums.js';

export const CalendarQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  batchId: z.coerce.number().int().optional(),
});

export type CalendarQuery = z.infer<typeof CalendarQuerySchema>;

export const DailyScheduleQuerySchema = z.object({
  date: z.coerce.date(),
});

export type DailyScheduleQuery = z.infer<typeof DailyScheduleQuerySchema>;

export const CreateBatchClassSchema = z.object({
  batchId: z.number().int().min(1),
  classDate: z.coerce.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be HH:MM or HH:MM:SS'),
  endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be HH:MM or HH:MM:SS'),
  classType: z.enum(ClassType).default('regular'),
  expertId: z.number().int().optional(),
});

export type CreateBatchClassBody = z.infer<typeof CreateBatchClassSchema>;

export const UpdateBatchClassSchema = z.object({
  classDate: z.coerce.date().optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'rescheduled']).optional(),
  expertId: z.number().int().optional(),
});

export type UpdateBatchClassBody = z.infer<typeof UpdateBatchClassSchema>;
