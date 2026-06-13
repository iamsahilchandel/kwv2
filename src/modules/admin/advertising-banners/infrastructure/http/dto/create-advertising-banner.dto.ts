import { z } from 'zod';

export enum BannerType {
  center = 'center',
  learner = 'learner',
  expert = 'expert',
  all = 'all',
}

export const CreateAdvertisingBannerSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.url(),
  imageKey: z.string().min(1),
  linkUrl: z.url().optional(),
  type: z.enum(BannerType),
  isActive: z.boolean().optional(),
});

export type CreateAdvertisingBannerBody = z.infer<
  typeof CreateAdvertisingBannerSchema
>;
