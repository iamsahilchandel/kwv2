import { Module } from '@nestjs/common';
import { LearnerBatchesController } from './infrastructure/http/learner-batches.controller.js';
import { LearnerBatchesService } from './application/learner-batches.service.js';

@Module({
  controllers: [LearnerBatchesController],
  providers: [LearnerBatchesService],
})
export class LearnerBatchesModule {}
