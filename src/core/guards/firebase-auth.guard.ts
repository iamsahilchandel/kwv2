import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  SetMetadata,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Auth } from 'firebase-admin/auth';
import type { Request } from 'express';
import { FIREBASE_AUTH } from '../firebase/firebase.module.js';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(FIREBASE_AUTH) private readonly firebaseAuth: Auth,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      this.logger.warn('Missing Authorization header', {
        method: request.method,
        url: request.originalUrl,
        ip: request.ip,
      });
      throw new UnauthorizedException('Missing Authorization header');
    }

    try {
      const decoded = await this.firebaseAuth.verifyIdToken(token, true);
      const rawPhone: string = decoded.phone_number ?? '';
      const phone = rawPhone.replace(/\D/g, '').slice(-10);

      this.logger.debug('Firebase token verified', {
        uid: decoded.uid,
        phone,
        url: request.originalUrl,
      });

      request.firebaseUser = { phone, uid: decoded.uid };
    } catch (err: unknown) {
      const e = err as {
        errorInfo?: { code?: string; message?: string };
        code?: string;
        message?: string;
      };
      const code: string = e?.errorInfo?.code ?? e?.code ?? 'unknown';
      const message: string =
        e?.errorInfo?.message ?? e?.message ?? 'No message';

      this.logger.warn('Firebase token verification failed', {
        code,
        message,
        method: request.method,
        url: request.originalUrl,
        ip: request.ip,
        tokenPrefix: token.slice(0, 20) + '…',
      });

      if (
        code === 'auth/id-token-expired' ||
        code === 'auth/id-token-revoked'
      ) {
        throw new UnauthorizedException('Token expired or revoked');
      }
      throw new UnauthorizedException('Invalid Firebase token');
    }

    return true;
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return null;
    return auth.slice(7);
  }
}
