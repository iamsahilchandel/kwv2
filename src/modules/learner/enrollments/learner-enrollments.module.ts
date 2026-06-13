import { Module } from '@nestjs/common';
import { LearnerEnrollmentsController } from './infrastructure/http/learner-enrollments.controller.js';
import { LearnerEnrollmentsService } from './application/learner-enrollments.service.js';

@Module({
  controllers: [LearnerEnrollmentsController],
  providers: [LearnerEnrollmentsService],
})
export class LearnerEnrollmentsModule {}
