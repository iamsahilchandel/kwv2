import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const PaymentRejectSchema = z.object({
  reasons: z.array(z.string()).optional(),
});

export type PaymentRejectBody = z.infer<typeof PaymentRejectSchema>;

export class PaymentRejectDto extends createZodDto(PaymentRejectSchema) {}
