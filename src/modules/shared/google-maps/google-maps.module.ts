import { Module } from '@nestjs/common';
import { GoogleMapsAdapter } from './infrastructure/adapters/google-maps.adapter.js';
import { GoogleMapsController } from './infrastructure/http/google-maps.controller.js';
import { GOOGLE_MAPS_PORT } from './application/ports/google-maps.port.js';

@Module({
  controllers: [GoogleMapsController],
  providers: [
    { provide: GOOGLE_MAPS_PORT, useClass: GoogleMapsAdapter },
  ],
  exports: [GOOGLE_MAPS_PORT],
})
export class GoogleMapsModule {}
