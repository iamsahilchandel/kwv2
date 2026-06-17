import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { appConfig } from './config/app.config.js';
import { databaseConfig } from './config/database.config.js';
import { firebaseConfig } from './config/firebase.config.js';
import { awsConfig } from './config/aws.config.js';
import { cashfreeConfig } from './config/cashfree.config.js';
import { googleMapsConfig } from './config/google-maps.config.js';
import { govPicklistConfig } from './config/gov-picklist.config.js';
import { HttpLoggerMiddleware } from './core/middleware/http-logger.middleware.js';
import { DatabaseModule } from './core/database/database.module.js';
import { FirebaseAuthGuard } from './core/guards/firebase-auth.guard.js';
import { RolesGuard } from './core/guards/roles.guard.js';
import { HttpExceptionFilter } from './core/filters/http-exception.filter.js';
import { ResponseInterceptor } from './core/interceptors/response.interceptor.js';
import { FirebaseModule } from './core/firebase/firebase.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { CenterModule } from './modules/center/center.module.js';
import { ExpertModule } from './modules/expert/expert.module.js';
import { LearnerModule } from './modules/learner/learner.module.js';
import { PublicPortalModule } from './modules/public/public.module.js';
import { SharedModule } from './modules/shared/shared.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        firebaseConfig,
        awsConfig,
        cashfreeConfig,
        googleMapsConfig,
        govPicklistConfig,
      ],
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
    FirebaseModule,
    HealthModule,
    AdminModule,
    CenterModule,
    ExpertModule,
    LearnerModule,
    PublicPortalModule,
    SharedModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: FirebaseAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
