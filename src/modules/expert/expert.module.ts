import { Module } from '@nestjs/common';
import { ExpertAuthModule } from './auth/expert-auth.module.js';
import { ExpertProfileModule } from './profile/expert-profile.module.js';

/**
 * Expert portal root module.
 * Import all expert sub-modules here as they are implemented.
 */
@Module({
  imports: [ExpertAuthModule, ExpertProfileModule],
})
export class ExpertModule {}
