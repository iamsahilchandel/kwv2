import { Module } from '@nestjs/common';
import { LearnerAttendanceController } from './infrastructure/http/learner-attendance.controller.js';
import { LearnerAttendanceService } from './application/learner-attendance.service.js';

@Module({
  controllers: [LearnerAttendanceController],
  providers: [LearnerAttendanceService],
})
export class LearnerAttendanceModule {}
