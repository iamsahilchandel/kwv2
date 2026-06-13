import { Module } from '@nestjs/common';
import { CenterAdvertisingBannersController } from './infrastructure/http/center-advertising-banners.controller.js';
import { CenterAdvertisingBannersService } from './application/center-advertising-banners.service.js';

@Module({
  controllers: [CenterAdvertisingBannersController],
  providers: [CenterAdvertisingBannersService],
})
export class CenterAdvertisingBannersModule {}
