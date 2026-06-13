import { Module } from '@nestjs/common';
import { LearnerAuthModule } from './auth/learner-auth.module.js';
import { LearnerAdvertisingBannersModule } from './advertising-banners/learner-advertising-banners.module.js';
import { LearnerAttendanceModule } from './attendance/learner-attendance.module.js';
import { LearnerBatchesModule } from './batches/learner-batches.module.js';
import { LearnerCalendarModule } from './calendar/learner-calendar.module.js';
import { LearnerCentersModule } from './centers/learner-centers.module.js';
import { LearnerEnrollmentsModule } from './enrollments/learner-enrollments.module.js';
import { LearnerExpertsModule } from './experts/learner-experts.module.js';
import { LearnerHomeModule } from './home/learner-home.module.js';
import { LearnerMasterListModule } from './master-list/learner-master-list.module.js';
import { LearnerNotificationsModule } from './notifications/learner-notifications.module.js';
import { LearnerPicklistsModule } from './picklists/learner-picklists.module.js';
import { LearnerProfileModule } from './profile/learner-profile.module.js';
import { LearnerReferralsModule } from './referrals/learner-referrals.module.js';

@Module({
  imports: [
    LearnerAuthModule,
    LearnerAdvertisingBannersModule,
    LearnerAttendanceModule,
    LearnerBatchesModule,
    LearnerCalendarModule,
    LearnerCentersModule,
    LearnerEnrollmentsModule,
    LearnerExpertsModule,
    LearnerHomeModule,
    LearnerMasterListModule,
    LearnerNotificationsModule,
    LearnerPicklistsModule,
    LearnerProfileModule,
    LearnerReferralsModule,
  ],
})
export class LearnerModule {}
