import { Module } from '@nestjs/common';
import { LearnerReferralsController } from './infrastructure/http/learner-referrals.controller.js';
import { LearnerReferralsService } from './application/learner-referrals.service.js';

@Module({
  controllers: [LearnerReferralsController],
  providers: [LearnerReferralsService],
})
export class LearnerReferralsModule {}
