import { Module } from '@nestjs/common';
import { CenterAuthController } from './infrastructure/http/center-auth.controller.js';
import { CenterAuthService } from './application/center-auth.service.js';

@Module({
  controllers: [CenterAuthController],
  providers: [CenterAuthService],
})
export class CenterAuthModule {}
