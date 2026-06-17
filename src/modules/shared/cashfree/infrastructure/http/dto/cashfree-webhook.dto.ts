import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CashfreeWebhookHeadersSchema = z.object({
  'x-webhook-signature': z.string().min(1),
  'x-webhook-timestamp': z.string().min(1),
});

export type CashfreeWebhookHeaders = z.infer<
  typeof CashfreeWebhookHeadersSchema
>;

export class CashfreeWebhookHeadersDto extends createZodDto(
  CashfreeWebhookHeadersSchema,
) {}
