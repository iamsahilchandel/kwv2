import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { appConfig } from '@config/app.config.js';
import { databaseConfig } from '@config/database.config.js';
import { redisConfig } from '@config/redis.config.js';
import { DatabaseModule } from '@core/database/database.module.js';
import { RedisModule } from '@core/redis/redis.module.js';
import { ApiKeyGuard } from '@core/guards/api-key.guard.js';
import { HttpExceptionFilter } from '@core/filters/http-exception.filter.js';
import { ResponseInterceptor } from '@core/interceptors/response.interceptor.js';
import { HealthModule } from '@modules/health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('app.throttleTtl') ?? 60000,
            limit: config.get<number>('app.throttleLimit') ?? 100,
          },
        ],
      }),
    }),
    DatabaseModule,
    RedisModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
