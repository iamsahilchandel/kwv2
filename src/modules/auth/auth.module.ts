import { Module } from '@nestjs/common';
import { AdminAuthController } from './controllers/admin-auth.controller.js';
import { CenterAuthController } from './controllers/center-auth.controller.js';
import { ExpertAuthController } from './controllers/expert-auth.controller.js';
import { LearnerAuthController } from './controllers/learner-auth.controller.js';
import { AdminAuthService } from './services/admin-auth.service.js';
import { CenterAuthService } from './services/center-auth.service.js';
import { ExpertAuthService } from './services/expert-auth.service.js';
import { LearnerAuthService } from './services/learner-auth.service.js';
import { AdminAuthGuard } from '@/core/guards/admin-auth.guard.js';
import { CenterStaffAuthGuard } from '@/core/guards/center-staff-auth.guard.js';
import { ExpertAuthGuard } from '@/core/guards/expert-auth.guard.js';
import { LearnerAuthGuard } from '@/core/guards/learner-auth.guard.js';

@Module({
  controllers: [
    AdminAuthController,
    CenterAuthController,
    ExpertAuthController,
    LearnerAuthController,
  ],
  providers: [
    AdminAuthService,
    CenterAuthService,
    ExpertAuthService,
    LearnerAuthService,
    AdminAuthGuard,
    CenterStaffAuthGuard,
    ExpertAuthGuard,
    LearnerAuthGuard,
  ],
})
export class AuthModule {}
