import { Module } from '@nestjs/common';
import { ExpertController } from './controllers/expert.controller.js';
import { ExpertService } from './services/expert.service.js';
import { ExpertAuthGuard } from '@/core/guards/expert-auth.guard.js';

@Module({
  controllers: [ExpertController],
  providers: [ExpertService, ExpertAuthGuard],
})
export class ExpertModule {}
