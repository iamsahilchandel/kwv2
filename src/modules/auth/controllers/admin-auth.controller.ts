import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Public } from '../../../core/guards/api-key.guard.js';
import { AdminAuthGuard } from '../../../core/guards/admin-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../../../core/pipes/zod-validation.pipe.js';
import { AdminAuthService } from '../services/admin-auth.service.js';
import {
  LoginBodySchema,
  VerifyNumberSchema,
  type LoginBody,
  type VerifyNumberBody,
} from '../dto/login.dto.js';
import type { IAuthUser } from '../../../common/interfaces/auth-user.interface.js';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('verify-number')
  @Public()
  verifyNumber(
    @Body(new ZodValidationPipe(VerifyNumberSchema)) body: VerifyNumberBody,
  ) {
    return this.adminAuthService.verifyNumber(body.phoneNumber);
  }

  @Post('login')
  @UseGuards(AdminAuthGuard)
  login(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(LoginBodySchema)) body: LoginBody,
  ) {
    return this.adminAuthService.login(user, body.fcmToken);
  }

  @Post('logout')
  @UseGuards(AdminAuthGuard)
  logout(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(LoginBodySchema)) body: LoginBody,
  ) {
    return this.adminAuthService.logout(user, body.fcmToken);
  }
}
