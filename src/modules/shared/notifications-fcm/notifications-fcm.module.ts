import { Module } from '@nestjs/common';
import { NotificationsFcmService } from './application/notifications-fcm.service.js';
import { FcmAdapter } from './infrastructure/adapters/fcm.adapter.js';
import { NotificationsFcmController } from './infrastructure/http/notifications-fcm.controller.js';
import { FCM_PORT } from './application/ports/fcm.port.js';

@Module({
  controllers: [NotificationsFcmController],
  providers: [
    NotificationsFcmService,
    { provide: FCM_PORT, useClass: FcmAdapter },
  ],
  exports: [NotificationsFcmService],
})
export class NotificationsFcmModule {}
