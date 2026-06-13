import { Module } from '@nestjs/common';
import { ExpertClassRescheduleController } from './infrastructure/http/expert-class-reschedule.controller.js';
import { ExpertClassRescheduleService } from './application/expert-class-reschedule.service.js';

@Module({
  controllers: [ExpertClassRescheduleController],
  providers: [ExpertClassRescheduleService],
})
export class ExpertClassRescheduleModule {}
