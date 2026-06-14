import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ExpertAuthGuard } from '../../../core/guards/expert-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { FirebaseUser } from '../../../common/decorators/firebase-user.decorator.js';
import { ZodValidationPipe } from '../../../core/pipes/zod-validation.pipe.js';
import { ExpertService } from '../services/expert.service.js';
import {
  RegisterExpertSchema,
  UpdateExpertSchema,
  type RegisterExpertBody,
  type UpdateExpertBody,
} from '../dto/expert.dto.js';
import type {
  IAuthUser,
  IFirebaseUser,
} from '../../../common/interfaces/auth-user.interface.js';

@Controller('expert')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @Get('me')
  @UseGuards(ExpertAuthGuard)
  getProfile(@CurrentUser() user: IAuthUser) {
    return this.expertService.getProfile(user.id);
  }

  @Post('register')
  register(
    @FirebaseUser() firebaseUser: IFirebaseUser,
    @Body(new ZodValidationPipe(RegisterExpertSchema)) body: RegisterExpertBody,
  ) {
    return this.expertService.register(firebaseUser, body);
  }

  @Patch('me')
  @UseGuards(ExpertAuthGuard)
  updateProfile(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(UpdateExpertSchema)) body: UpdateExpertBody,
  ) {
    return this.expertService.updateProfile(user, body);
  }

  @Post('terms')
  @UseGuards(ExpertAuthGuard)
  acceptTerms(@CurrentUser() user: IAuthUser) {
    return this.expertService.acceptTerms(user.id);
  }
}
