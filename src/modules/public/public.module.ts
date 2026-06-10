import { Module } from '@nestjs/common';

/**
 * Public-facing endpoints root module (no auth required).
 * Import public sub-modules here as they are implemented.
 */
@Module({
  imports: [],
})
export class PublicPortalModule {}
