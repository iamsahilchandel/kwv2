import { Module } from '@nestjs/common';
import { ExpertNotificationsController } from './infrastructure/http/expert-notifications.controller.js';
import { ExpertNotificationsService } from './application/expert-notifications.service.js';

@Module({
  controllers: [ExpertNotificationsController],
  providers: [ExpertNotificationsService],
})
export class ExpertNotificationsModule {}
