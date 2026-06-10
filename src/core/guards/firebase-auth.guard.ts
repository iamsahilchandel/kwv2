import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Auth } from 'firebase-admin/auth';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from './api-key.guard.js';
import { FIREBASE_AUTH } from '../firebase/firebase.module.js';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
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
      throw new UnauthorizedException('Missing Authorization header');
    }

    try {
      const decoded = await this.firebaseAuth.verifyIdToken(token, true);
      const rawPhone: string = decoded.phone_number ?? '';
      const phone = rawPhone.replace(/\D/g, '').slice(-10);

      request.firebaseUser = { phone, uid: decoded.uid };
    } catch (err: any) {
      const code: string = err?.errorInfo?.code ?? err?.code ?? '';
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
