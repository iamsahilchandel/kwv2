import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../../../../core/guards/firebase-auth.guard.js';
import { CenterStaffAuthGuard } from '../../../../../core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import { CenterAuthService } from '../../application/center-auth.service.js';
import {
  CenterVerifyNumberSchema,
  CenterLoginSchema,
  type CenterVerifyNumberBody,
  type CenterLoginBody,
  CenterVerifyNumberDto,
  CenterLoginDto,
} from './dto/center-auth.dto.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';

@ApiTags('Center - Authentication')
@Controller('center/auth')
export class CenterAuthController {
  constructor(private readonly centerAuthService: CenterAuthService) {}

  @ApiOperation({ summary: 'Verify center staff phone number before login' })
  @Post('verify-number')
  @Public()
  verifyNumber(
    @Body()
    body: CenterVerifyNumberDto,
  ) {
    return this.centerAuthService.verifyNumber(body.phoneNumber);
  }

  @ApiOperation({ summary: 'Center staff login with Firebase token' })
  @ApiBearerAuth('firebase-token')
  @Post('login')
  @UseGuards(CenterStaffAuthGuard)
  login(@CurrentUser() user: IAuthUser, @Body() body: CenterLoginDto) {
    return this.centerAuthService.login(user, body.fcmToken);
  }

  @ApiOperation({ summary: 'Center staff logout' })
  @ApiBearerAuth('firebase-token')
  @Post('logout')
  @UseGuards(CenterStaffAuthGuard)
  logout(@CurrentUser() user: IAuthUser, @Body() body: CenterLoginDto) {
    return this.centerAuthService.logout(user, body.fcmToken);
  }
}
