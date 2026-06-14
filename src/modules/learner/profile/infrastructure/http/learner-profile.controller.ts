import {
  Controller,
  Get,
  Put,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LearnerAuthGuard } from '../../../../../core/guards/learner-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { LearnerProfileService } from '../../application/learner-profile.service.js';
import {
  UpdateLearnerSchema,
  type UpdateLearnerDto,
  CreateProfileSchema,
  type CreateProfileDto,
  UpdateProfileSchema,
  type UpdateProfileDto,
} from './dto/learner-profile.dto.js';

@ApiTags('Learner - Profile')
@ApiBearerAuth()
@UseGuards(LearnerAuthGuard)
@Controller('learner/profile')
export class LearnerProfileController {
  constructor(private readonly service: LearnerProfileService) {}

  @Post('accept-terms')
  acceptTerms(@CurrentUser() user: IAuthUser) {
    return this.service.acceptTerms(user.id);
  }

  @Get('me')
  getMe(@CurrentUser() user: IAuthUser) {
    return this.service.getMe(user.id);
  }

  @Put('me')
  updateMe(
    @Body(new ZodValidationPipe(UpdateLearnerSchema)) dto: UpdateLearnerDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.updateMe(user.id, dto);
  }

  @Get('sub-profiles')
  getAllProfiles(@CurrentUser() user: IAuthUser) {
    return this.service.getAllProfiles(user.id);
  }

  @Post('sub-profiles')
  createProfile(
    @Body(new ZodValidationPipe(CreateProfileSchema)) dto: CreateProfileDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.createProfile(user.id, dto);
  }

  @Get('sub-profiles/:profileId')
  getProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.getProfile(user.id, profileId);
  }

  @Patch('sub-profiles/:profileId')
  updateProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @Body(new ZodValidationPipe(UpdateProfileSchema)) dto: UpdateProfileDto,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.updateProfile(user.id, profileId, dto);
  }

  @Delete('sub-profiles/:profileId')
  deleteProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.deleteProfile(user.id, profileId);
  }
}
