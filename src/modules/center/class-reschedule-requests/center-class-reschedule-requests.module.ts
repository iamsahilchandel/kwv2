import { Module } from '@nestjs/common';
import { CenterClassRescheduleRequestsController } from './infrastructure/http/center-class-reschedule-requests.controller.js';
import { CenterClassRescheduleRequestsService } from './application/center-class-reschedule-requests.service.js';

@Module({
  controllers: [CenterClassRescheduleRequestsController],
  providers: [CenterClassRescheduleRequestsService],
})
export class CenterClassRescheduleRequestsModule {}
