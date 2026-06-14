import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExpertAuthGuard } from '../../../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { ExpertAuthService } from '../../application/expert-auth.service.js';
import {
  ExpertLoginSchema,
  type ExpertLoginBody,
} from './dto/expert-auth.dto.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';

@ApiTags('Expert - Authentication')
@ApiBearerAuth('firebase-token')
@UseGuards(ExpertAuthGuard)
@Controller('expert/auth')
export class ExpertAuthController {
  constructor(private readonly expertAuthService: ExpertAuthService) {}

  @ApiOperation({ summary: 'Expert login with Firebase token' })
  @Post('login')
  login(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(ExpertLoginSchema)) body: ExpertLoginBody,
  ) {
    return this.expertAuthService.login(user, body.fcmToken);
  }

  @ApiOperation({ summary: 'Expert logout' })
  @Post('logout')
  logout(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(ExpertLoginSchema)) body: ExpertLoginBody,
  ) {
    return this.expertAuthService.logout(user, body.fcmToken);
  }
}
