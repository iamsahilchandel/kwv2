import { z } from 'zod';
import { CenterType, CenterOperatingEntity } from '@/generated/prisma/enums.js';

export const UpdateCenterSchema = z.object({
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  centerType: z.enum(CenterType).optional(),
  operatingEntity: z.enum(CenterOperatingEntity).optional(),
  commissionPercentage: z.number().min(0).optional(),
  reasonForNotVerified: z.array(z.string()).optional(),
});

export type UpdateCenterBody = z.infer<typeof UpdateCenterSchema>;
