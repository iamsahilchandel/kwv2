import { Module } from '@nestjs/common';
import { CenterExpertsController } from './infrastructure/http/center-experts.controller.js';
import { CenterExpertsService } from './application/center-experts.service.js';

@Module({
  controllers: [CenterExpertsController],
  providers: [CenterExpertsService],
})
export class CenterExpertsModule {}
