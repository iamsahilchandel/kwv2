import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/admin-auth.module.js';

/**
 * Admin portal root module.
 * Import all admin sub-modules here as they are implemented.
 */
@Module({
  imports: [AdminAuthModule],
})
export class AdminModule {}
