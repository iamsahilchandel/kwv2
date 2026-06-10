import { z } from 'zod';

export const LearnerLoginSchema = z.object({
  fcmToken: z.string().min(1, 'FCM token is required'),
});

export type LearnerLoginBody = z.infer<typeof LearnerLoginSchema>;
