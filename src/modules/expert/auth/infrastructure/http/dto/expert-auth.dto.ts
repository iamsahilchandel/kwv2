import { z } from 'zod';

export const ExpertLoginSchema = z.object({
  fcmToken: z.string().min(1, 'FCM token is required'),
});

export type ExpertLoginBody = z.infer<typeof ExpertLoginSchema>;
