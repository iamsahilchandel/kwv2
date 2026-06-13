import { Module } from '@nestjs/common';
import { CenterLearnersController } from './infrastructure/http/center-learners.controller.js';
import { CenterLearnersService } from './application/center-learners.service.js';

@Module({
  controllers: [CenterLearnersController],
  providers: [CenterLearnersService],
})
export class CenterLearnersModule {}
