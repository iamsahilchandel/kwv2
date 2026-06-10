import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Public } from '@/core/guards/api-key.guard.js';
import { CenterStaffAuthGuard } from '@/core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { CenterAuthService } from '../services/center-auth.service.js';
import {
  LoginBodySchema,
  VerifyNumberSchema,
  type LoginBody,
  type VerifyNumberBody,
} from '../dto/login.dto.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';

@Controller('center/auth')
export class CenterAuthController {
  constructor(private readonly centerAuthService: CenterAuthService) {}

  @Post('verify-number')
  @Public()
  verifyNumber(
    @Body(new ZodValidationPipe(VerifyNumberSchema)) body: VerifyNumberBody,
  ) {
    return this.centerAuthService.verifyNumber(body.phoneNumber);
  }

  @Post('login')
  @UseGuards(CenterStaffAuthGuard)
  login(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(LoginBodySchema)) body: LoginBody,
  ) {
    return this.centerAuthService.login(user, body.fcmToken);
  }

  @Post('logout')
  @UseGuards(CenterStaffAuthGuard)
  logout(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(LoginBodySchema)) body: LoginBody,
  ) {
    return this.centerAuthService.logout(user, body.fcmToken);
  }
}
