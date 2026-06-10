export interface FcmSendResult {
  successCount: number;
  failureCount: number;
  failedTokens: Array<{ token: string; errorCode: string }>;
}

export interface FcmMessage {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  actionUrl?: string;
  priority?: 'high' | 'normal';
  timeToLive?: number;
}

export interface IFcmPort {
  /** Send to multiple device tokens. Returns per-token success/failure results. */
  sendMulticast(tokens: string[], message: FcmMessage): Promise<FcmSendResult>;
  /** Dry-run a single token to verify it is still valid with Firebase. */
  validateToken(token: string): Promise<boolean>;
}

export const FCM_PORT = Symbol('IFcmPort');
