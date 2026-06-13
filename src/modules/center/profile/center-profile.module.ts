import { Module } from '@nestjs/common';
import { CenterProfileController } from './infrastructure/http/center-profile.controller.js';
import { CenterProfileService } from './application/center-profile.service.js';

@Module({
  controllers: [CenterProfileController],
  providers: [CenterProfileService],
})
export class CenterProfileModule {}
