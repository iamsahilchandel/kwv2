import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { BannerType } from './create-advertising-banner.dto.js';

export const UpdateAdvertisingBannerSchema = z.object({
  title: z.string().min(1).optional(),
  imageUrl: z.url().optional(),
  imageKey: z.string().min(1).optional(),
  linkUrl: z.url().optional(),
  type: z.enum(BannerType).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateAdvertisingBannerBody = z.infer<
  typeof UpdateAdvertisingBannerSchema
>;

export class UpdateAdvertisingBannerDto extends createZodDto(
  UpdateAdvertisingBannerSchema,
) {}
