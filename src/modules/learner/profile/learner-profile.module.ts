import { Module } from '@nestjs/common';
import { LearnerProfileController } from './infrastructure/http/learner-profile.controller.js';
import { LearnerProfileService } from './application/learner-profile.service.js';

@Module({
  controllers: [LearnerProfileController],
  providers: [LearnerProfileService],
})
export class LearnerProfileModule {}
