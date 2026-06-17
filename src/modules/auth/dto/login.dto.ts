import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const LoginBodySchema = z.object({
  fcmToken: z.string().optional().nullable(),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;

export const VerifyNumberSchema = z.object({
  phoneNumber: z.string().length(10),
});

export type VerifyNumberBody = z.infer<typeof VerifyNumberSchema>;

export class LoginBodyDto extends createZodDto(LoginBodySchema) {}
export class VerifyNumberDto extends createZodDto(VerifyNumberSchema) {}
