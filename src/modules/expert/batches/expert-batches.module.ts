import { Module } from '@nestjs/common';
import { ExpertBatchesController } from './infrastructure/http/expert-batches.controller.js';
import { ExpertBatchesService } from './application/expert-batches.service.js';

@Module({
  controllers: [ExpertBatchesController],
  providers: [ExpertBatchesService],
})
export class ExpertBatchesModule {}
