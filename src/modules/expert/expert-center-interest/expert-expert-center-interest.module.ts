import { Module } from '@nestjs/common';
import { ExpertExpertCenterInterestController } from './infrastructure/http/expert-expert-center-interest.controller.js';
import { ExpertExpertCenterInterestService } from './application/expert-expert-center-interest.service.js';

@Module({
  controllers: [ExpertExpertCenterInterestController],
  providers: [ExpertExpertCenterInterestService],
})
export class ExpertExpertCenterInterestModule {}
