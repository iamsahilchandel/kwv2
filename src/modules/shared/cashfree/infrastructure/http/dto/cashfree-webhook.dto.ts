import { z } from 'zod';

export const CashfreeWebhookHeadersSchema = z.object({
  'x-webhook-signature': z.string().min(1),
  'x-webhook-timestamp': z.string().min(1),
});

export type CashfreeWebhookHeaders = z.infer<
  typeof CashfreeWebhookHeadersSchema
>;
