import { registerAs } from '@nestjs/config';

export const govPicklistConfig = registerAs('govPicklist', () => ({
  apiKey: process.env.KREO_OPEN_GOVERNMENT_DATA_API_KEY ?? '',
}));
