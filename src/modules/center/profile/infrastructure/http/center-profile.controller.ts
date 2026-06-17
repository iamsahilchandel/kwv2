import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CenterStaffAuthGuard } from '../../../../../core/guards/center-staff-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { CenterProfileService } from '../../application/center-profile.service.js';
import {
  UpdateCenterProfileSchema,
  type UpdateCenterProfileBody,
  UpdateCenterProfileDto,
  SubmitUpdateRequestSchema,
  type SubmitUpdateRequestBody,
  SubmitUpdateRequestDto,
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
    @Body() dto: UpdateCenterProfileDto,
  ) {
    return this.service.updateProfile(user.id, dto);
  }

  @Post('update-request')
  submitUpdateRequest(
    @CurrentUser() user: IAuthUser,
    @Body() dto: SubmitUpdateRequestDto,
  ) {
    return this.service.submitUpdateRequest(user.id, dto);
  }

  @Get('update-requests')
  getUpdateRequests(@CurrentUser() user: IAuthUser) {
    return this.service.getUpdateRequests(user.id);
  }
}
