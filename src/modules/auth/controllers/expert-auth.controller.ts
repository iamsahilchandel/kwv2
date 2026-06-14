import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ExpertAuthGuard } from '../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../../../core/pipes/zod-validation.pipe.js';
import { ExpertAuthService } from '../services/expert-auth.service.js';
import { LoginBodySchema, type LoginBody } from '../dto/login.dto.js';
import type { IAuthUser } from '../../../common/interfaces/auth-user.interface.js';

@Controller('expert/auth')
@UseGuards(ExpertAuthGuard)
export class ExpertAuthController {
  constructor(private readonly expertAuthService: ExpertAuthService) {}

  @Post('login')
  login(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(LoginBodySchema)) body: LoginBody,
  ) {
    return this.expertAuthService.login(user, body.fcmToken);
  }

  @Post('logout')
  logout(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(LoginBodySchema)) body: LoginBody,
  ) {
    return this.expertAuthService.logout(user, body.fcmToken);
  }
}
