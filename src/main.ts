import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import { setupApp } from '@/bootstrap/app.setup.js';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  // rawBody: true is required by the Cashfree webhook controller for signature verification
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.setGlobalPrefix('api');

  // Global validation: strip unknown fields, auto-coerce types, reject invalid data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  setupApp(app);

  // Swagger — protected by basic auth configured in app.setup.ts
  const config = app.get(ConfigService);
  const swaggerUsername = config.get<string>('app.swaggerUsername') ?? 'admin';
  // const swaggerPassword = config.get<string>('app.swaggerPassword') ?? 'admin';

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kreo World API v2')
    .setDescription('Kreo World API — migrated to NestJS')
    .setVersion('2.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Firebase ID Token' },
      'firebase-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Kreo World API Docs',
    // Basic auth is handled via a custom middleware in app.setup.ts
  });

  const port = config.get<number>('app.port') ?? process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Application running on port ${port}`);
  logger.log(`Swagger docs at http://localhost:${port}/api-docs`);
  logger.log(`Swagger auth: ${swaggerUsername} / [hidden]`);
}

bootstrap().catch((err) => {
  logger.error('Error starting the application', err);
  process.exit(1);
});
