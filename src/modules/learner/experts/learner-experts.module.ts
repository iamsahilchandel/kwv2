import { Module } from '@nestjs/common';
import { LearnerExpertsController } from './infrastructure/http/learner-experts.controller.js';
import { LearnerExpertsService } from './application/learner-experts.service.js';

@Module({
  controllers: [LearnerExpertsController],
  providers: [LearnerExpertsService],
})
export class LearnerExpertsModule {}
