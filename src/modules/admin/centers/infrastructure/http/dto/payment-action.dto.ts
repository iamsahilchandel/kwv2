import { z } from 'zod';

export const PaymentRejectSchema = z.object({
  reasons: z.array(z.string()).optional(),
});

export type PaymentRejectBody = z.infer<typeof PaymentRejectSchema>;
