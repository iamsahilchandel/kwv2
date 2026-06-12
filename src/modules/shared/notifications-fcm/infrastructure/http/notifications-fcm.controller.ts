import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@/core/decorators/public.decorator.js';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe.js';
import { NotificationsFcmService } from '../../application/notifications-fcm.service.js';
import { RegisterFcmTokenSchema, type RegisterFcmTokenBody } from './dto/register-fcm.dto.js';

@ApiTags('Shared - FCM Notifications')
@Controller('notification')
export class NotificationsFcmController {
  constructor(private readonly fcmService: NotificationsFcmService) {}

  @ApiOperation({ summary: 'Register or update an FCM device token for push notifications' })
  @Public()
  @Post('register-fcm')
  @HttpCode(HttpStatus.OK)
  async registerFcmToken(@Body(new ZodValidationPipe(RegisterFcmTokenSchema)) dto: RegisterFcmTokenBody) {
    const result = await this.fcmService.registerDevice(
      dto.userType,
      dto.userId,
      dto.fcmToken,
      dto.deviceType,
      dto.deviceInfo,
    );

    return {
      ...result,
      message: result.isNewDevice ? 'Device registered successfully' : 'Device token updated successfully',
    };
  }
}
