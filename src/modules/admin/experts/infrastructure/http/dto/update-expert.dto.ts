import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateExpertSchema = z.object({
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

export type UpdateExpertBody = z.infer<typeof UpdateExpertSchema>;

export class UpdateExpertDto extends createZodDto(UpdateExpertSchema) {}
