import { z } from 'zod';
import { ServiceGroup } from '../../../../../../generated/prisma/enums.js';

export const UpdateServiceSchema = z.object({
  serviceGroup: z.enum(ServiceGroup).optional(),
  serviceName: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
});

export type UpdateServiceBody = z.infer<typeof UpdateServiceSchema>;
