import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../../../../core/guards/firebase-auth.guard.js';
import { AdminAuthGuard } from '../../../../../core/guards/admin-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import { AdminAuthService } from '../../application/admin-auth.service.js';
import { AdminVerifyNumberDto, AdminLoginDto } from './dto/admin-auth.dto.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';

@ApiTags('Admin - Authentication')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @ApiOperation({ summary: 'Verify admin phone number before login' })
  @Post('verify-number')
  @Public()
  verifyNumber(
    @Body()
    body: AdminVerifyNumberDto,
  ) {
    return this.adminAuthService.verifyNumber(body.phoneNumber);
  }

  @ApiOperation({ summary: 'Admin login with Firebase token' })
  @ApiBearerAuth('firebase-token')
  @Post('login')
  @UseGuards(AdminAuthGuard)
  login(@CurrentUser() user: IAuthUser, @Body() body: AdminLoginDto) {
    return this.adminAuthService.login(user, body.fcmToken);
  }

  @ApiOperation({ summary: 'Admin logout and revoke Firebase token' })
  @ApiBearerAuth('firebase-token')
  @Post('logout')
  @UseGuards(AdminAuthGuard)
  logout(@CurrentUser() user: IAuthUser, @Body() body: AdminLoginDto) {
    return this.adminAuthService.logout(user, body.fcmToken);
  }
}
