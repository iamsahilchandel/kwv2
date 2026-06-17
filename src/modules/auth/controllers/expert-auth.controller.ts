import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ExpertAuthGuard } from '../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { ExpertAuthService } from '../services/expert-auth.service.js';
import {
  LoginBodySchema,
  type LoginBody,
  LoginBodyDto,
} from '../dto/login.dto.js';
import type { IAuthUser } from '../../../common/interfaces/auth-user.interface.js';

@Controller('expert/auth')
@UseGuards(ExpertAuthGuard)
export class ExpertAuthController {
  constructor(private readonly expertAuthService: ExpertAuthService) {}

  @Post('login')
  login(@CurrentUser() user: IAuthUser, @Body() body: LoginBodyDto) {
    return this.expertAuthService.login(user, body.fcmToken);
  }

  @Post('logout')
  logout(@CurrentUser() user: IAuthUser, @Body() body: LoginBodyDto) {
    return this.expertAuthService.logout(user, body.fcmToken);
  }
}
