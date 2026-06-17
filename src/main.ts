import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module.js';
import { setupApp } from './bootstrap/app.setup.js';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  // rawBody: true is required by the Cashfree webhook controller for signature verification
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ZodValidationPipe());

  setupApp(app);

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port') ?? process.env.PORT ?? 3000;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kreo World API v2')
    .setDescription('Kreo World API — migrated to NestJS')
    .setVersion('2.0')
    .addServer(`http://localhost:${port}`, 'Local')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Firebase ID Token' },
      'learner-token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Firebase ID Token' },
      'expert-token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Firebase ID Token' },
      'center-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Kreo World API Docs',
    // Basic auth is handled via a custom middleware in app.setup.ts
  });

  await app.listen(port);

  logger.log(`Application running on port ${port}`);
  logger.log(`Swagger docs at http://localhost:${port}/api-docs`);
}

bootstrap().catch((err) => {
  logger.error('Error starting the application', err);
  process.exit(1);
});
