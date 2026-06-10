import { INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';

export function setupApp(app: INestApplication) {
  const config = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(helmet());
  app.use(compression());

  const corsOrigins = config.get<string[]>('app.corsOrigins') ?? ['*'];
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Protect Swagger UI with HTTP basic auth
  const swaggerUsername = config.get<string>('app.swaggerUsername') ?? 'admin';
  const swaggerPassword = config.get<string>('app.swaggerPassword') ?? 'admin';

  app.use('/api-docs', (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Kreo API Docs"');
      res.status(401).send('Unauthorized');
      return;
    }
    const base64 = authHeader.slice('Basic '.length);
    const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
    if (user !== swaggerUsername || pass !== swaggerPassword) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Kreo API Docs"');
      res.status(401).send('Unauthorized');
      return;
    }
    next();
  });
}
