import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ExpertLoginSchema = z.object({
  fcmToken: z.string().min(1, 'FCM token is required'),
});

export type ExpertLoginBody = z.infer<typeof ExpertLoginSchema>;

export class ExpertLoginDto extends createZodDto(ExpertLoginSchema) {}
