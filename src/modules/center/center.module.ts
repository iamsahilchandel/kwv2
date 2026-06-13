import { Module } from '@nestjs/common';
import { CenterAuthModule } from './auth/center-auth.module.js';
import { CenterAdvertisingBannersModule } from './advertising-banners/center-advertising-banners.module.js';
import { CenterBatchesModule } from './batches/center-batches.module.js';
import { CenterCalendarModule } from './calendar/center-calendar.module.js';
import { CenterClassRescheduleRequestsModule } from './class-reschedule-requests/center-class-reschedule-requests.module.js';
import { CenterDashboardModule } from './dashboard/center-dashboard.module.js';
import { CenterEnrollmentsModule } from './enrollments/center-enrollments.module.js';
import { CenterExpertCenterInterestModule } from './expert-center-interest/center-expert-center-interest.module.js';
import { CenterExpertsModule } from './experts/center-experts.module.js';
import { CenterLearnersModule } from './learners/center-learners.module.js';
import { CenterMasterListModule } from './master-list/center-master-list.module.js';
import { CenterPaymentsModule } from './payments/center-payments.module.js';
import { CenterPicklistsModule } from './picklists/center-picklists.module.js';
import { CenterProfileModule } from './profile/center-profile.module.js';
import { CenterReschedulePollsModule } from './reschedule-polls/center-reschedule-polls.module.js';
import { CenterStaffModule } from './staff/center-staff.module.js';

@Module({
  imports: [
    CenterAuthModule,
    CenterAdvertisingBannersModule,
    CenterBatchesModule,
    CenterCalendarModule,
    CenterClassRescheduleRequestsModule,
    CenterDashboardModule,
    CenterEnrollmentsModule,
    CenterExpertCenterInterestModule,
    CenterExpertsModule,
    CenterLearnersModule,
    CenterMasterListModule,
    CenterPaymentsModule,
    CenterPicklistsModule,
    CenterProfileModule,
    CenterReschedulePollsModule,
    CenterStaffModule,
  ],
})
export class CenterModule {}
