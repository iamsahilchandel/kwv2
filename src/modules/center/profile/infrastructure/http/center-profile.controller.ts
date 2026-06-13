import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '@/core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { IAuthUser } from '@/common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { CenterProfileService } from '../../application/center-profile.service.js';
import {
  UpdateCenterProfileSchema,
  type UpdateCenterProfileBody,
  SubmitUpdateRequestSchema,
  type SubmitUpdateRequestBody,
} from './dto/center-profile.dto.js';

@ApiTags('Center - Profile')
@ApiBearerAuth()
@UseGuards(CenterStaffAuthGuard)
@Controller('center/profile')
export class CenterProfileController {
  constructor(private readonly service: CenterProfileService) {}

  @Get()
  getProfile(@CurrentUser() user: IAuthUser) {
    return this.service.getProfile(user.id);
  }

  @Patch()
  updateProfile(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(UpdateCenterProfileSchema)) dto: UpdateCenterProfileBody,
  ) {
    return this.service.updateProfile(user.id, dto);
  }

  @Post('update-request')
  submitUpdateRequest(
    @CurrentUser() user: IAuthUser,
    @Body(new ZodValidationPipe(SubmitUpdateRequestSchema)) dto: SubmitUpdateRequestBody,
  ) {
    return this.service.submitUpdateRequest(user.id, dto);
  }

  @Get('update-requests')
  getUpdateRequests(@CurrentUser() user: IAuthUser) {
    return this.service.getUpdateRequests(user.id);
  }
}
