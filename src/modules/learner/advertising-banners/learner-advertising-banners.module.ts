import { Module } from '@nestjs/common';
import { LearnerAdvertisingBannersController } from './infrastructure/http/learner-advertising-banners.controller.js';
import { LearnerAdvertisingBannersService } from './application/learner-advertising-banners.service.js';

@Module({
  controllers: [LearnerAdvertisingBannersController],
  providers: [LearnerAdvertisingBannersService],
})
export class LearnerAdvertisingBannersModule {}
