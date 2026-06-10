import { Module } from '@nestjs/common';
import { LearnerAuthModule } from './auth/learner-auth.module.js';

/**
 * Learner portal root module.
 * Import all learner sub-modules here as they are implemented.
 */
@Module({
  imports: [LearnerAuthModule],
})
export class LearnerModule {}
