import { Module } from '@nestjs/common';
import { ExpertLearnersController } from './infrastructure/http/expert-learners.controller.js';
import { ExpertLearnersService } from './application/expert-learners.service.js';

@Module({
  controllers: [ExpertLearnersController],
  providers: [ExpertLearnersService],
})
export class ExpertLearnersModule {}
