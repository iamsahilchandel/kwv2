import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import type {
  IFcmPort,
  FcmMessage,
  FcmSendResult,
} from '../../application/ports/fcm.port.js';

const BATCH_SIZE = 500;

@Injectable()
export class FcmAdapter implements IFcmPort {
  private readonly logger = new Logger(FcmAdapter.name);

  async sendMulticast(
    tokens: string[],
    message: FcmMessage,
  ): Promise<FcmSendResult> {
    const result: FcmSendResult = {
      successCount: 0,
      failureCount: 0,
      failedTokens: [],
    };

    const basePayload: Omit<admin.messaging.MulticastMessage, 'tokens'> = {
      notification: {
        title: message.title,
        body: message.body,
        ...(message.imageUrl && { imageUrl: message.imageUrl }),
      },
      data: message.data ?? {},
      android: {
        priority: message.priority === 'high' ? 'high' : 'normal',
        ttl: (message.timeToLive ?? 86400) * 1000,
        notification: {
          title: message.title,
          body: message.body,
          ...(message.imageUrl && { imageUrl: message.imageUrl }),
          ...(message.actionUrl && { clickAction: message.actionUrl }),
        },
      },
      apns: {
        payload: {
          aps: {
            alert: { title: message.title, body: message.body },
            badge: 1,
            sound: 'default',
          },
          ...(message.actionUrl && { url: message.actionUrl }),
        },
      },
      webpush: {
        headers: { TTL: String(message.timeToLive ?? 86400) },
        notification: {
          title: message.title,
          body: message.body,
          ...(message.imageUrl && { icon: message.imageUrl }),
        },
        ...(message.actionUrl && { fcmOptions: { link: message.actionUrl } }),
      },
    };

    // Firebase multicast limit is 500 tokens per call
    for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
      const batch = tokens.slice(i, i + BATCH_SIZE);
      try {
        const response = await admin
          .messaging()
          .sendEachForMulticast({ ...basePayload, tokens: batch });
        result.successCount += response.successCount;
        result.failureCount += response.failureCount;

        response.responses.forEach((resp, idx) => {
          if (!resp.success && resp.error) {
            result.failedTokens.push({
              token: batch[idx],
              errorCode: resp.error.code ?? 'UNKNOWN',
            });
          }
        });
      } catch (err) {
        this.logger.error(
          `FCM multicast batch failed at offset ${i}`,
          (err as Error).stack,
        );
        result.failureCount += batch.length;
        batch.forEach((token) =>
          result.failedTokens.push({ token, errorCode: 'BATCH_ERROR' }),
        );
      }
    }

    return result;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await admin
        .messaging()
        .send({ data: { test: 'validation' }, token }, true); // dryRun = true
      return true;
    } catch (err) {
      const code = err.code ?? '';
      if (
        code === 'messaging/invalid-registration-token' ||
        code === 'messaging/registration-token-not-registered'
      ) {
        return false;
      }
      // Other errors (auth, network) — assume token is still valid
      this.logger.warn(`FCM token validation inconclusive: ${code}`);
      return true;
    }
  }
}
