import { z } from 'zod';

export const CenterVerifyNumberSchema = z.object({
  phoneNumber: z.string().length(10, 'Phone number must be exactly 10 digits'),
});

export const CenterLoginSchema = z.object({
  fcmToken: z.string().min(1, 'FCM token is required'),
});

export type CenterVerifyNumberBody = z.infer<typeof CenterVerifyNumberSchema>;
export type CenterLoginBody = z.infer<typeof CenterLoginSchema>;
