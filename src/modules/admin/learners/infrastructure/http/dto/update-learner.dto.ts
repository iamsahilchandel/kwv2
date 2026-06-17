import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateLearnerSchema = z.object({
  termsAccepted: z.boolean().optional(),
});

export type UpdateLearnerBody = z.infer<typeof UpdateLearnerSchema>;

export class UpdateLearnerDto extends createZodDto(UpdateLearnerSchema) {}
