import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  env: process.env.NODE_ENV ?? 'development',
  apiKey: process.env.API_KEY ?? '',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') ?? ['*'],
  throttleTtl: parseInt(process.env.THROTTLE_TTL ?? '60000', 10),
  throttleLimit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
  swaggerUsername: process.env.SWAGGER_USERNAME ?? 'admin',
  swaggerPassword: process.env.SWAGGER_PASSWORD ?? 'admin',
}));
