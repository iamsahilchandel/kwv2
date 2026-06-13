import { Module } from '@nestjs/common';
import { LearnerNotificationsController } from './infrastructure/http/learner-notifications.controller.js';
import { LearnerNotificationsService } from './application/learner-notifications.service.js';

@Module({
  controllers: [LearnerNotificationsController],
  providers: [LearnerNotificationsService],
})
export class LearnerNotificationsModule {}
