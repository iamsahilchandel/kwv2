import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Public } from '../../../core/guards/firebase-auth.guard.js';
import { AdminAuthGuard } from '../../../core/guards/admin-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { AdminAuthService } from '../services/admin-auth.service.js';
import {
  LoginBodySchema,
  VerifyNumberSchema,
  type LoginBody,
  type VerifyNumberBody,
  LoginBodyDto,
  VerifyNumberDto,
} from '../dto/login.dto.js';
import type { IAuthUser } from '../../../common/interfaces/auth-user.interface.js';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('verify-number')
  @Public()
  verifyNumber(@Body() body: VerifyNumberDto) {
    return this.adminAuthService.verifyNumber(body.phoneNumber);
  }

  @Post('login')
  @UseGuards(AdminAuthGuard)
  login(@CurrentUser() user: IAuthUser, @Body() body: LoginBodyDto) {
    return this.adminAuthService.login(user, body.fcmToken);
  }

  @Post('logout')
  @UseGuards(AdminAuthGuard)
  logout(@CurrentUser() user: IAuthUser, @Body() body: LoginBodyDto) {
    return this.adminAuthService.logout(user, body.fcmToken);
  }
}
