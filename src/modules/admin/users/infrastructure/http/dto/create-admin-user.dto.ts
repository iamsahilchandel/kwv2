import { z } from 'zod';
import { AdminRole } from '../../../../../../generated/prisma/enums.js';

export const CreateAdminUserSchema = z.object({
  fullName: z.string().max(50),
  email: z.email(),
  phoneNumber: z.string().max(15),
  role: z.enum(AdminRole),
  reportsTo: z.coerce.number().int().min(1).optional(),
});

export type CreateAdminUserBody = z.infer<typeof CreateAdminUserSchema>;
