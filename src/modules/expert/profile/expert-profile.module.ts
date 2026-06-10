import { Module } from '@nestjs/common';
import { ExpertProfileController } from './infrastructure/http/expert-profile.controller.js';
import { ExpertProfileService } from './application/expert-profile.service.js';

@Module({
  controllers: [ExpertProfileController],
  providers: [ExpertProfileService],
})
export class ExpertProfileModule {}
