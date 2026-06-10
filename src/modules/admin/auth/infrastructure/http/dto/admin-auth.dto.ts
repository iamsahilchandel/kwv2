import { z } from 'zod';

export const AdminVerifyNumberSchema = z.object({
  phoneNumber: z.string().length(10, 'Phone number must be exactly 10 digits'),
});

export const AdminLoginSchema = z.object({
  fcmToken: z.string().min(1, 'FCM token is required'),
});

export type AdminVerifyNumberBody = z.infer<typeof AdminVerifyNumberSchema>;
export type AdminLoginBody = z.infer<typeof AdminLoginSchema>;
