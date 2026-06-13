import { z } from 'zod';

export enum BannerType {
  center = 'center',
  learner = 'learner',
  expert = 'expert',
  all = 'all',
}

export const CreateAdvertisingBannerSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().url(),
  imageKey: z.string().min(1),
  linkUrl: z.string().url().optional(),
  type: z.nativeEnum(BannerType),
  isActive: z.boolean().optional(),
});

export type CreateAdvertisingBannerBody = z.infer<
  typeof CreateAdvertisingBannerSchema
>;
