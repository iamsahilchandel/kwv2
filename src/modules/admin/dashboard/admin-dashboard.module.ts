import { Module } from '@nestjs/common';
import { AdminDashboardController } from './infrastructure/http/admin-dashboard.controller.js';
import { AdminDashboardService } from './application/admin-dashboard.service.js';

@Module({
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
})
export class AdminDashboardModule {}
