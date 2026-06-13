import { Module } from '@nestjs/common';
import { ExpertAdvertisingBannersController } from './infrastructure/http/expert-advertising-banners.controller.js';
import { ExpertAdvertisingBannersService } from './application/expert-advertising-banners.service.js';

@Module({
  controllers: [ExpertAdvertisingBannersController],
  providers: [ExpertAdvertisingBannersService],
})
export class ExpertAdvertisingBannersModule {}
