import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LearnerAuthGuard } from '../../../../../core/guards/learner-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import { FirebaseUser } from '../../../../../common/decorators/firebase-user.decorator.js';
import { LearnerAuthService } from '../../application/learner-auth.service.js';
import {
  LearnerLoginSchema,
  type LearnerLoginBody,
  LearnerLoginDto,
} from './dto/learner-auth.dto.js';
import type {
  IAuthUser,
  IFirebaseUser,
} from '../../../../../common/interfaces/auth-user.interface.js';

@ApiTags('Learner - Authentication')
@Controller('learner/auth')
export class LearnerAuthController {
  constructor(private readonly learnerAuthService: LearnerAuthService) {}

  @ApiOperation({
    summary: 'Learner login — auto-creates account on first login',
  })
  @ApiBearerAuth('firebase-token')
  @Post('login')
  login(
    @FirebaseUser() firebaseUser: IFirebaseUser,
    @Body() body: LearnerLoginDto,
  ) {
    return this.learnerAuthService.login(firebaseUser, body.fcmToken);
  }

  @ApiOperation({ summary: 'Learner logout' })
  @ApiBearerAuth('firebase-token')
  @UseGuards(LearnerAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: IAuthUser, @Body() body: LearnerLoginDto) {
    return this.learnerAuthService.logout(user, body.fcmToken);
  }
}
