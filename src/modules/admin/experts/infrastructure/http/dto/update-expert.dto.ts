import { z } from 'zod';

export const UpdateExpertSchema = z.object({
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

export type UpdateExpertBody = z.infer<typeof UpdateExpertSchema>;
