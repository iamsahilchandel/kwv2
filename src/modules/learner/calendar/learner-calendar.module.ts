import { Module } from '@nestjs/common';
import { LearnerCalendarController } from './infrastructure/http/learner-calendar.controller.js';
import { LearnerCalendarService } from './application/learner-calendar.service.js';

@Module({
  controllers: [LearnerCalendarController],
  providers: [LearnerCalendarService],
})
export class LearnerCalendarModule {}
