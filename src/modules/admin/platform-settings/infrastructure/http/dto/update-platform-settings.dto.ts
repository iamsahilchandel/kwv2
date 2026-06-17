import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdatePlatformSettingsSchema = z.object({
  value: z.string().max(5000),
  description: z.string().max(1000).optional(),
});

export type UpdatePlatformSettingsBody = z.infer<
  typeof UpdatePlatformSettingsSchema
>;

export class UpdatePlatformSettingsDto extends createZodDto(
  UpdatePlatformSettingsSchema,
) {}
