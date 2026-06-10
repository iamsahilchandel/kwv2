import { Module } from '@nestjs/common';
import { AdminAuthController } from './infrastructure/http/admin-auth.controller.js';
import { AdminAuthService } from './application/admin-auth.service.js';

@Module({
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
