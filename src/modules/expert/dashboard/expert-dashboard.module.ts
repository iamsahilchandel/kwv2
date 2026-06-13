import { Module } from '@nestjs/common';
import { ExpertDashboardController } from './infrastructure/http/expert-dashboard.controller.js';
import { ExpertDashboardService } from './application/expert-dashboard.service.js';

@Module({
  controllers: [ExpertDashboardController],
  providers: [ExpertDashboardService],
})
export class ExpertDashboardModule {}
