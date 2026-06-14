import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../../../core/guards/admin-auth.guard.js';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator.js';
import type { IAuthUser } from '../../../../../common/interfaces/auth-user.interface.js';
import { ZodValidationPipe } from '../../../../../core/pipes/zod-validation.pipe.js';
import { AdminMarketingService } from '../../application/admin-marketing.service.js';
import {
  SendPushNotificationSchema,
  type SendPushNotificationBody,
} from './dto/send-push-notification.dto.js';

@ApiTags('Admin - Marketing')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin/marketing')
export class AdminMarketingController {
  constructor(private readonly service: AdminMarketingService) {}

  @Post('push-notification/send')
  sendPushNotification(
    @Body(new ZodValidationPipe(SendPushNotificationSchema))
    dto: SendPushNotificationBody,
    @CurrentUser() user: IAuthUser,
  ) {
    return this.service.sendPushNotification(dto, user.id);
  }
}
