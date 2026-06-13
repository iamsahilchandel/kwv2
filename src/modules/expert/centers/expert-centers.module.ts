import { Module } from '@nestjs/common';
import { ExpertCentersController } from './infrastructure/http/expert-centers.controller.js';
import { ExpertCentersService } from './application/expert-centers.service.js';

@Module({
  controllers: [ExpertCentersController],
  providers: [ExpertCentersService],
})
export class ExpertCentersModule {}
