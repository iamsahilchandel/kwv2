import { Module } from '@nestjs/common';
import { AdminCouponsController } from './infrastructure/http/admin-coupons.controller.js';
import { AdminCouponsService } from './application/admin-coupons.service.js';

@Module({
  controllers: [AdminCouponsController],
  providers: [AdminCouponsService],
})
export class AdminCouponsModule {}
