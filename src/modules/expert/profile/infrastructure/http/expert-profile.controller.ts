import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExpertAuthGuard } from '@/core/guards/expert-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import { FirebaseUser } from '@/common/decorators/firebase-user.decorator.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { ExpertProfileService } from '../../application/expert-profile.service.js';
import {
  RegisterExpertSchema,
  UpdateExpertProfileSchema,
  type RegisterExpertBody,
  type UpdateExpertProfileBody,
} from './dto/expert-profile.dto.js';
import type {
  IAuthUser,
  IFirebaseUser,
} from '@/common/interfaces/auth-user.interface.js';

@ApiTags('Expert - Profile')
@Controller('expert')
export class ExpertProfileController {
  constructor(private readonly expertProfileService: ExpertProfileService) {}

  @ApiOperation({ summary: 'Get expert profile' })
  @ApiBearerAuth('firebase-token')
  @Get('me')
  @UseGuards(ExpertAuthGuard)
  getProfile(@CurrentUser() user: IAuthUser) {
    return this.expertProfileService.getProfile(user.id);
  }

  @ApiOperation({ summary: 'Register new expert account' })
  @ApiBearerAuth('firebase-token')
  @Post('register')
  register(
    @FirebaseUser() firebaseUser: IFirebaseUser,
    @Body(new ZodValidationPipe(RegisterExpertSchema)) body: RegisterExpertBody,
  ) {
    return this.expertProfileService.register(firebaseUser, body);
  }

  @ApiOperation({ summary: 'Update expert profile' })
  @ApiBearerAuth('firebase-token')
  @Patch('me')
  @UseGuards(ExpertAuthGuard)
  updateProfile(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(UpdateExpertProfileSchema))
    body: UpdateExpertProfileBody,
  ) {
    return this.expertProfileService.updateProfile(user, body);
  }

  @ApiOperation({ summary: 'Accept terms and conditions' })
  @ApiBearerAuth('firebase-token')
  @Post('me/accept-terms')
  @UseGuards(ExpertAuthGuard)
  acceptTerms(@CurrentUser() user: IAuthUser) {
    return this.expertProfileService.acceptTerms(user.id);
  }
}
