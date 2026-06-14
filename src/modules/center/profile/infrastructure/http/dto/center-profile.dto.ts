import { z } from 'zod';
import { CenterType, CenterOperatingEntity } from '../../../../../../generated/prisma/enums.js';

export const UpdateCenterProfileSchema = z.object({
  centerName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(10).max(15).optional(),
  website: z.string().url().optional(),
  numberOfEmployees: z.coerce.number().int().min(1).optional(),
  centerType: z.enum(CenterType).optional(),
  operatingEntity: z.enum(CenterOperatingEntity).optional(),
  dailyOperatingHours: z.record(z.string(), z.unknown()).optional(),
  address: z.record(z.string(), z.unknown()).optional(),
  isNotifyByEmail: z.boolean().optional(),
  isNotifyByPushAlert: z.boolean().optional(),
  isNotifyBySms: z.boolean().optional(),
  isNotifyByWhatsapp: z.boolean().optional(),
});

export type UpdateCenterProfileBody = z.infer<typeof UpdateCenterProfileSchema>;

export const SubmitUpdateRequestSchema = z.object({
  centerName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(10).max(15).optional(),
  website: z.string().url().optional(),
  numberOfEmployees: z.coerce.number().int().min(1).optional(),
  centerType: z.enum(CenterType).optional(),
  operatingEntity: z.enum(CenterOperatingEntity).optional(),
  dailyOperatingHours: z.record(z.string(), z.unknown()).optional(),
  address: z.record(z.string(), z.unknown()).optional(),
  centerDescription: z.string().max(2000).optional(),
  vision: z.string().max(1000).optional(),
});

export type SubmitUpdateRequestBody = z.infer<typeof SubmitUpdateRequestSchema>;
