import { Module } from '@nestjs/common';
import { CenterAuthModule } from './auth/center-auth.module.js';

/**
 * Center portal root module.
 * Import all center sub-modules here as they are implemented.
 */
@Module({
  imports: [CenterAuthModule],
})
export class CenterModule {}
