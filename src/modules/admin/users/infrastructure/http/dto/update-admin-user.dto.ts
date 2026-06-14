import { z } from 'zod';
import { AdminRole } from '../../../../../../generated/prisma/enums.js';

export const UpdateAdminUserSchema = z.object({
  fullName: z.string().max(50).optional(),
  email: z.email().optional(),
  phoneNumber: z.string().max(15).optional(),
  role: z.enum(AdminRole).optional(),
  reportsTo: z.coerce.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateAdminUserBody = z.infer<typeof UpdateAdminUserSchema>;
