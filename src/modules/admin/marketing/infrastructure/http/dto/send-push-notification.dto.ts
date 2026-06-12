import { z } from 'zod';

export enum MarketingUserType {
  appadmin = 'appadmin',
  centerstaff = 'centerstaff',
  expert = 'expert',
  learner = 'learner',
}

export enum NotificationPriority {
  high = 'high',
  normal = 'normal',
  low = 'low',
}

export const SendPushNotificationSchema = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(500),
  imageUrl: z.string().url().optional(),
  userType: z.nativeEnum(MarketingUserType),
  priority: z.nativeEnum(NotificationPriority).optional(),
});

export type SendPushNotificationBody = z.infer<typeof SendPushNotificationSchema>;
