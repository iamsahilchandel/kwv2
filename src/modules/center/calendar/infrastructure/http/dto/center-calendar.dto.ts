import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ClassType } from '../../../../../../generated/prisma/enums.js';

export const CalendarQuerySchema = z.object({
  startDate: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val)),
  endDate: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val)),
  batchId: z.coerce.number().int().optional(),
});

export type CalendarQuery = z.infer<typeof CalendarQuerySchema>;

export const DailyScheduleQuerySchema = z.object({
  date: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val)),
});

export type DailyScheduleQuery = z.infer<typeof DailyScheduleQuerySchema>;

export const CreateBatchClassSchema = z.object({
  batchId: z.number().int().min(1),
  classDate: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val)),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be HH:MM or HH:MM:SS'),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be HH:MM or HH:MM:SS'),
  classType: z.enum(ClassType).default('regular'),
  expertId: z.number().int().optional(),
});

export type CreateBatchClassBody = z.infer<typeof CreateBatchClassSchema>;

export const UpdateBatchClassSchema = z.object({
  classDate: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val))
    .optional(),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional(),
  status: z
    .enum(['scheduled', 'completed', 'cancelled', 'rescheduled'])
    .optional(),
  expertId: z.number().int().optional(),
});

export type UpdateBatchClassBody = z.infer<typeof UpdateBatchClassSchema>;

export class CalendarQueryDto extends createZodDto(CalendarQuerySchema) {}
export class DailyScheduleQueryDto extends createZodDto(
  DailyScheduleQuerySchema,
) {}
export class CreateBatchClassDto extends createZodDto(CreateBatchClassSchema) {}
export class UpdateBatchClassDto extends createZodDto(UpdateBatchClassSchema) {}
