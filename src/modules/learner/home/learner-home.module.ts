import { Module } from '@nestjs/common';
import { LearnerHomeController } from './infrastructure/http/learner-home.controller.js';
import { LearnerHomeService } from './application/learner-home.service.js';

@Module({
  controllers: [LearnerHomeController],
  providers: [LearnerHomeService],
})
export class LearnerHomeModule {}
