import { Module } from '@nestjs/common';
import { LearnerAuthController } from './infrastructure/http/learner-auth.controller.js';
import { LearnerAuthService } from './application/learner-auth.service.js';

@Module({
  controllers: [LearnerAuthController],
  providers: [LearnerAuthService],
})
export class LearnerAuthModule {}
