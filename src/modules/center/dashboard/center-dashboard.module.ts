import { Module } from '@nestjs/common';
import { CenterDashboardController } from './infrastructure/http/center-dashboard.controller.js';
import { CenterDashboardService } from './application/center-dashboard.service.js';

@Module({
  controllers: [CenterDashboardController],
  providers: [CenterDashboardService],
})
export class CenterDashboardModule {}
