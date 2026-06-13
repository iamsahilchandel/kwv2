import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import type {
  ICashfreePort,
  CashfreeWebhookPayload,
} from '../../application/ports/cashfree.port.js';

@Injectable()
export class CashfreeAdapter implements ICashfreePort {
  private readonly logger = new Logger(CashfreeAdapter.name);
  private readonly cashfree: Cashfree;

  constructor(private readonly config: ConfigService) {
    const clientId = this.config.get<string>('cashfree.clientId');
    const clientSecret = this.config.get<string>('cashfree.clientSecret');
    const env = this.config.get<string>('cashfree.env') ?? 'PRODUCTION';

    const cfEnv =
      env === 'SANDBOX' ? CFEnvironment.SANDBOX : CFEnvironment.PRODUCTION;

    this.cashfree = new Cashfree(cfEnv, clientId, clientSecret);

    this.logger.log(`Cashfree adapter initialized in ${env} mode`);
  }

  verifyWebhook(
    signature: string,
    rawBody: string,
    timestamp: string,
  ): CashfreeWebhookPayload {
    // PGVerifyWebhookSignature throws if signature is invalid
    const parsedBody = this.cashfree.PGVerifyWebhookSignature(
      signature,
      rawBody,
      timestamp,
    );

    return {
      type: parsedBody.type,
      object: parsedBody,
      raw: rawBody,
    };
  }
}
