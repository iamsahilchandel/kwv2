import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cashfree } from 'cashfree-pg';
import type {
  ICashfreePort,
  CashfreeWebhookPayload,
} from '../../application/ports/cashfree.port.js';

@Injectable()
export class CashfreeAdapter implements ICashfreePort {
  private readonly logger = new Logger(CashfreeAdapter.name);

  constructor(private readonly config: ConfigService) {
    const clientId = this.config.get<string>('cashfree.clientId');
    const clientSecret = this.config.get<string>('cashfree.clientSecret');
    const env = this.config.get<string>('cashfree.env') ?? 'PRODUCTION';

    Cashfree.XClientId = clientId;
    Cashfree.XClientSecret = clientSecret;
    Cashfree.XEnvironment =
      env === 'SANDBOX'
        ? Cashfree.Environment.SANDBOX
        : Cashfree.Environment.PRODUCTION;

    this.logger.log(`Cashfree adapter initialized in ${env} mode`);
  }

  verifyWebhook(
    signature: string,
    rawBody: string,
    timestamp: string,
  ): CashfreeWebhookPayload {
    // PGVerifyWebhookSignature throws if signature is invalid
    const parsedBody = Cashfree.PGVerifyWebhookSignature(
      signature,
      rawBody,
      timestamp,
    );

    return {
      type: (parsedBody as any).type,
      object: parsedBody,
      raw: rawBody,
    };
  }
}
