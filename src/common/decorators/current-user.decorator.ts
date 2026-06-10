import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { IAuthUser } from '../interfaces/auth-user.interface.js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IAuthUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user!;
  },
);
