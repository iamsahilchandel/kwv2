import { Module } from '@nestjs/common';
import { ExpertAuthModule } from './auth/expert-auth.module.js';
import { ExpertProfileModule } from './profile/expert-profile.module.js';
import { ExpertAdvertisingBannersModule } from './advertising-banners/expert-advertising-banners.module.js';
import { ExpertAgreementsModule } from './agreements/expert-agreements.module.js';
import { ExpertBatchClassAttendanceModule } from './batch-class-attendance/expert-batch-class-attendance.module.js';
import { ExpertBatchClassMediaModule } from './batch-class-media/expert-batch-class-media.module.js';
import { ExpertBatchesModule } from './batches/expert-batches.module.js';
import { ExpertCalendarModule } from './calendar/expert-calendar.module.js';
import { ExpertCentersModule } from './centers/expert-centers.module.js';
import { ExpertClassRescheduleModule } from './class-reschedule/expert-class-reschedule.module.js';
import { ExpertDashboardModule } from './dashboard/expert-dashboard.module.js';
import { ExpertExpertCenterInterestModule } from './expert-center-interest/expert-expert-center-interest.module.js';
import { ExpertLearnersModule } from './learners/expert-learners.module.js';
import { ExpertMasterListModule } from './master-list/expert-master-list.module.js';
import { ExpertNotificationsModule } from './notifications/expert-notifications.module.js';
import { ExpertPicklistsModule } from './picklists/expert-picklists.module.js';

@Module({
  imports: [
    ExpertAuthModule,
    ExpertProfileModule,
    ExpertAdvertisingBannersModule,
    ExpertAgreementsModule,
    ExpertBatchClassAttendanceModule,
    ExpertBatchClassMediaModule,
    ExpertBatchesModule,
    ExpertCalendarModule,
    ExpertCentersModule,
    ExpertClassRescheduleModule,
    ExpertDashboardModule,
    ExpertExpertCenterInterestModule,
    ExpertLearnersModule,
    ExpertMasterListModule,
    ExpertNotificationsModule,
    ExpertPicklistsModule,
  ],
})
export class ExpertModule {}
