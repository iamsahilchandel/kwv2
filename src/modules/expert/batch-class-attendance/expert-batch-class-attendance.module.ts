import { Module } from '@nestjs/common';
import { ExpertBatchClassAttendanceController } from './infrastructure/http/expert-batch-class-attendance.controller.js';
import { ExpertBatchClassAttendanceService } from './application/expert-batch-class-attendance.service.js';

@Module({
  controllers: [ExpertBatchClassAttendanceController],
  providers: [ExpertBatchClassAttendanceService],
})
export class ExpertBatchClassAttendanceModule {}
