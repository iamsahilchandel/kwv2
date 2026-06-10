import { registerAs } from '@nestjs/config';

export const cashfreeConfig = registerAs('cashfree', () => ({
  clientId: process.env.CASHFREE_CLIENT_ID ?? '',
  clientSecret: process.env.CASHFREE_CLIENT_SECRET ?? '',
  env: process.env.CASHFREE_ENV ?? 'PRODUCTION',
}));
