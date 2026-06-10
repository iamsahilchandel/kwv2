import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LearnerAuthGuard } from '@/core/guards/learner-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import { FirebaseUser } from '@/common/decorators/firebase-user.decorator.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { LearnerAuthService } from '../services/learner-auth.service.js';
import { LoginBodySchema, type LoginBody } from '../dto/login.dto.js';
import type {
  IAuthUser,
  IFirebaseUser,
} from '@/common/interfaces/auth-user.interface.js';

@Controller('learner/auth')
export class LearnerAuthController {
  constructor(private readonly learnerAuthService: LearnerAuthService) {}

  @Post('login')
  login(
    @FirebaseUser() firebaseUser: IFirebaseUser,
    @Body(new ZodValidationPipe(LoginBodySchema)) body: LoginBody,
  ) {
    return this.learnerAuthService.login(firebaseUser, body.fcmToken);
  }

  @Post('logout')
  @UseGuards(LearnerAuthGuard)
  logout(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(LoginBodySchema)) body: LoginBody,
  ) {
    return this.learnerAuthService.logout(user, body.fcmToken);
  }
}
