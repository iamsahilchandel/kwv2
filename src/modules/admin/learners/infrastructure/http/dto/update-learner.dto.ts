import { z } from 'zod';

export const UpdateLearnerSchema = z.object({
  termsAccepted: z.boolean().optional(),
});

export type UpdateLearnerBody = z.infer<typeof UpdateLearnerSchema>;
