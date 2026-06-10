import { registerAs } from '@nestjs/config';

export const googleMapsConfig = registerAs('googleMaps', () => ({
  apiKey: process.env.KREO_GOOGLE_MAPS_API_KEY ?? '',
}));
