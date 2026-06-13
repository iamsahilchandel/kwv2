import { Module } from '@nestjs/common';
import { CenterBatchesController } from './infrastructure/http/center-batches.controller.js';
import { CenterBatchesService } from './application/center-batches.service.js';

@Module({
  controllers: [CenterBatchesController],
  providers: [CenterBatchesService],
})
export class CenterBatchesModule {}
