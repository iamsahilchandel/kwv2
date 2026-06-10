import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { IFirebaseUser } from '../interfaces/auth-user.interface.js';

export const FirebaseUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IFirebaseUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.firebaseUser!;
  },
);
