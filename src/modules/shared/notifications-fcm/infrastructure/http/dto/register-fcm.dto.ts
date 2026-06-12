import { z } from 'zod';

export enum UserType {
  AppAdmin = 'appadmin',
  CenterStaff = 'centerstaff',
  Learner = 'learner',
  Expert = 'expert',
}

export enum DeviceType {
  Android = 'android',
  iOS = 'ios',
  Web = 'web',
  Desktop = 'desktop',
}

export const RegisterFcmTokenSchema = z.object({
  fcmToken: z.string().min(100, 'FCM token appears invalid (too short)'),
  userId: z.number().int().positive(),
  userType: z.nativeEnum(UserType),
  deviceType: z.nativeEnum(DeviceType).optional(),
  deviceInfo: z.record(z.unknown()).optional(),
});

export type RegisterFcmTokenBody = z.infer<typeof RegisterFcmTokenSchema>;
