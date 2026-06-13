import { Module } from '@nestjs/common';
import { LearnerCentersController } from './infrastructure/http/learner-centers.controller.js';
import { LearnerCentersService } from './application/learner-centers.service.js';

@Module({
  controllers: [LearnerCentersController],
  providers: [LearnerCentersService],
})
export class LearnerCentersModule {}
