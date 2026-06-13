import { z } from 'zod';
import { BannerType } from './create-advertising-banner.dto.js';

export const UpdateAdvertisingBannerSchema = z.object({
  title: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
  imageKey: z.string().min(1).optional(),
  linkUrl: z.string().url().optional(),
  type: z.nativeEnum(BannerType).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateAdvertisingBannerBody = z.infer<
  typeof UpdateAdvertisingBannerSchema
>;
