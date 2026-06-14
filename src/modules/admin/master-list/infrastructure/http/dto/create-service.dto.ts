import { z } from 'zod';
import { ServiceGroup } from '../../../../../../generated/prisma/enums.js';

export const CreateServiceSchema = z.object({
  serviceGroup: z.enum(ServiceGroup),
  serviceName: z.string().max(100),
  description: z.string().max(500).optional(),
});

export type CreateServiceBody = z.infer<typeof CreateServiceSchema>;
