import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { setupApp } from '@bootstrap/app.setup.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupApp(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Application running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
