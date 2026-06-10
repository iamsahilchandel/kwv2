import { Module } from '@nestjs/common';
import { ExpertAuthController } from './infrastructure/http/expert-auth.controller.js';
import { ExpertAuthService } from './application/expert-auth.service.js';

@Module({
  controllers: [ExpertAuthController],
  providers: [ExpertAuthService],
})
export class ExpertAuthModule {}
