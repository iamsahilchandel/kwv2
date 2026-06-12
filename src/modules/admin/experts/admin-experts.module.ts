import { Module } from '@nestjs/common';
import { AdminExpertsController } from './infrastructure/http/admin-experts.controller.js';
import { AdminExpertsService } from './application/admin-experts.service.js';

@Module({
  controllers: [AdminExpertsController],
  providers: [AdminExpertsService],
})
export class AdminExpertsModule {}
