export interface CashfreeWebhookPayload {
  type: string;
  object: unknown;
  raw: string;
}

/** Port interface for Cashfree payment gateway operations. */
export interface ICashfreePort {
  /** Verify webhook signature and parse payload. Throws on invalid signature. */
  verifyWebhook(signature: string, rawBody: string, timestamp: string): CashfreeWebhookPayload;
}

export const CASHFREE_PORT = Symbol('ICashfreePort');
