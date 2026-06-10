import { IsString, IsNotEmpty } from 'class-validator';

export class CashfreeWebhookHeadersDto {
  @IsString()
  @IsNotEmpty()
  'x-webhook-signature': string;

  @IsString()
  @IsNotEmpty()
  'x-webhook-timestamp': string;
}
