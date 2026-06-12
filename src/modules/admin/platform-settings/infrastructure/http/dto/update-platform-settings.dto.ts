import { z } from 'zod';

export const UpdatePlatformSettingsSchema = z.object({
  value: z.string().max(5000),
  description: z.string().max(1000).optional(),
});

export type UpdatePlatformSettingsBody = z.infer<typeof UpdatePlatformSettingsSchema>;
