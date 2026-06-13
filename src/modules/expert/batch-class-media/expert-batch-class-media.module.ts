import { Module } from '@nestjs/common';
import { ExpertBatchClassMediaController } from './infrastructure/http/expert-batch-class-media.controller.js';
import { ExpertBatchClassMediaService } from './application/expert-batch-class-media.service.js';

@Module({
  controllers: [ExpertBatchClassMediaController],
  providers: [ExpertBatchClassMediaService],
})
export class ExpertBatchClassMediaModule {}
