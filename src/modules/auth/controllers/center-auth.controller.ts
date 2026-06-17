import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Public } from '../../../core/guards/firebase-auth.guard.js';
import { CenterStaffAuthGuard } from '../../../core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { CenterAuthService } from '../services/center-auth.service.js';
import {
  LoginBodySchema,
  VerifyNumberSchema,
  type LoginBody,
  type VerifyNumberBody,
  LoginBodyDto,
  VerifyNumberDto,
} from '../dto/login.dto.js';
import type { IAuthUser } from '../../../common/interfaces/auth-user.interface.js';

@Controller('center/auth')
export class CenterAuthController {
  constructor(private readonly centerAuthService: CenterAuthService) {}

  @Post('verify-number')
  @Public()
  verifyNumber(@Body() body: VerifyNumberDto) {
    return this.centerAuthService.verifyNumber(body.phoneNumber);
  }

  @Post('login')
  @UseGuards(CenterStaffAuthGuard)
  login(@CurrentUser() user: IAuthUser, @Body() body: LoginBodyDto) {
    return this.centerAuthService.login(user, body.fcmToken);
  }

  @Post('logout')
  @UseGuards(CenterStaffAuthGuard)
  logout(@CurrentUser() user: IAuthUser, @Body() body: LoginBodyDto) {
    return this.centerAuthService.logout(user, body.fcmToken);
  }
}
