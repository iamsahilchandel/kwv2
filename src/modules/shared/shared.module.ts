import { Module } from '@nestjs/common';
import { S3Module } from './s3/s3.module.js';
import { CashfreeModule } from './cashfree/cashfree.module.js';
import { NotificationsFcmModule } from './notifications-fcm/notifications-fcm.module.js';
import { GoogleMapsModule } from './google-maps/google-maps.module.js';
import { GovPicklistModule } from './gov-picklist/gov-picklist.module.js';
import { LoggerModule } from './logger/logger.module.js';

@Module({
  imports: [
    S3Module,
    CashfreeModule,
    NotificationsFcmModule,
    GoogleMapsModule,
    GovPicklistModule,
    LoggerModule,
  ],
  exports: [
    S3Module,
    CashfreeModule,
    NotificationsFcmModule,
    GoogleMapsModule,
    GovPicklistModule,
    LoggerModule,
  ],
})
export class SharedModule {}
