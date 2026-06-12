import { Module } from '@nestjs/common';
import { AdminAdvertisingBannersController } from './infrastructure/http/admin-advertising-banners.controller.js';
import { AdminAdvertisingBannersService } from './application/admin-advertising-banners.service.js';

@Module({
  controllers: [AdminAdvertisingBannersController],
  providers: [AdminAdvertisingBannersService],
})
export class AdminAdvertisingBannersModule {}
