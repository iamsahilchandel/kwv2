import { Module } from '@nestjs/common';
import { NotificationsFcmModule } from '../../../modules/shared/notifications-fcm/notifications-fcm.module.js';
import { AdminMarketingController } from './infrastructure/http/admin-marketing.controller.js';
import { AdminMarketingService } from './application/admin-marketing.service.js';

@Module({
  imports: [NotificationsFcmModule],
  controllers: [AdminMarketingController],
  providers: [AdminMarketingService],
})
export class AdminMarketingModule {}
