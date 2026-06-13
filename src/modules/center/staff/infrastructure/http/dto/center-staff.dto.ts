import { z } from 'zod';
import { CenterStaffRole } from '@/generated/prisma/enums.js';

export const CreateCenterStaffSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().max(50).optional(),
  email: z.email().optional(),
  phoneNumber: z.string().min(10).max(15),
  role: z.enum(CenterStaffRole),
  joinedOn: z.coerce.date().optional(),
});

export type CreateCenterStaffBody = z.infer<typeof CreateCenterStaffSchema>;

export const UpdateCenterStaffSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().max(50).optional(),
  email: z.email().optional(),
  role: z.enum(CenterStaffRole).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCenterStaffBody = z.infer<typeof UpdateCenterStaffSchema>;

export const QueryCenterStaffSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  role: z.enum(CenterStaffRole).optional(),
  isActive: z.coerce.boolean().optional(),
});

export type QueryCenterStaffQuery = z.infer<typeof QueryCenterStaffSchema>;
