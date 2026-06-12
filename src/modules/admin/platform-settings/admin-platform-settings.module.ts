import { Module } from '@nestjs/common';
import { AdminPlatformSettingsController } from './infrastructure/http/admin-platform-settings.controller.js';
import { AdminPlatformSettingsService } from './application/admin-platform-settings.service.js';

@Module({
  controllers: [AdminPlatformSettingsController],
  providers: [AdminPlatformSettingsService],
})
export class AdminPlatformSettingsModule {}
