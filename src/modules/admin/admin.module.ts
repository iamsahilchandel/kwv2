import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/admin-auth.module.js';
import { AdminAdvertisingBannersModule } from './advertising-banners/admin-advertising-banners.module.js';
import { AdminCentersModule } from './centers/admin-centers.module.js';
import { AdminCenterInquiriesModule } from './center-inquiries/admin-center-inquiries.module.js';
import { AdminCouponsModule } from './coupons/admin-coupons.module.js';
import { AdminDashboardModule } from './dashboard/admin-dashboard.module.js';
import { AdminExpertsModule } from './experts/admin-experts.module.js';
import { AdminLearnersModule } from './learners/admin-learners.module.js';
import { AdminMarketingModule } from './marketing/admin-marketing.module.js';
import { AdminMasterListModule } from './master-list/admin-master-list.module.js';
import { AdminPicklistsModule } from './picklists/admin-picklists.module.js';
import { AdminPlatformSettingsModule } from './platform-settings/admin-platform-settings.module.js';
import { AdminPlatformGeneralDocumentsModule } from './platform-general-documents/admin-platform-general-documents.module.js';
import { AdminUsersModule } from './users/admin-users.module.js';

@Module({
  imports: [
    AdminAuthModule,
    AdminAdvertisingBannersModule,
    AdminCentersModule,
    AdminCenterInquiriesModule,
    AdminCouponsModule,
    AdminDashboardModule,
    AdminExpertsModule,
    AdminLearnersModule,
    AdminMarketingModule,
    AdminMasterListModule,
    AdminPicklistsModule,
    AdminPlatformSettingsModule,
    AdminPlatformGeneralDocumentsModule,
    AdminUsersModule,
  ],
})
export class AdminModule {}
