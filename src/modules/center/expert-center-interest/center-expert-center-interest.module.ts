import { Module } from '@nestjs/common';
import { CenterExpertCenterInterestController } from './infrastructure/http/center-expert-center-interest.controller.js';
import { CenterExpertCenterInterestService } from './application/center-expert-center-interest.service.js';

@Module({
  controllers: [CenterExpertCenterInterestController],
  providers: [CenterExpertCenterInterestService],
})
export class CenterExpertCenterInterestModule {}
