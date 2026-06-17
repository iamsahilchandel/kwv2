import {
  Global,
  Logger,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  initializeApp,
  getApps,
  deleteApp,
  cert,
  applicationDefault,
  type App,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export const FIREBASE_AUTH = 'FIREBASE_AUTH';

const logger = new Logger('FirebaseModule');

@Global()
@Module({
  providers: [
    {
      provide: FIREBASE_AUTH,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const existing = getApps();
        let app: App;

        if (existing.length > 0) {
          logger.log('Reusing existing Firebase app', {
            name: existing[0].name,
          });
          app = existing[0];
        } else if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
          // FIREBASE_AUTH_EMULATOR_HOST is automatically read by the SDK;
          // only projectId is required — no real credentials needed for emulator.
          logger.warn('Initializing Firebase with Auth Emulator', {
            emulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
            projectId: process.env.GCLOUD_PROJECT,
          });
          app = initializeApp({ projectId: process.env.GCLOUD_PROJECT });
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          // SDK reads the JSON key file from GOOGLE_APPLICATION_CREDENTIALS automatically.
          logger.log('Initializing Firebase with GOOGLE_APPLICATION_CREDENTIALS', {
            credFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
          });
          app = initializeApp({ credential: applicationDefault() });
        } else {
          // Explicit service-account credentials from environment variables.
          const projectId = config.get<string>('firebase.projectId');
          const clientEmail = config.get<string>('firebase.clientEmail');

          if (!projectId || !clientEmail) {
            logger.error(
              'Firebase credentials are missing — FIREBASE_PROJECT_ID or FIREBASE_CLIENT_EMAIL not set',
              { projectId: projectId ?? '(missing)', clientEmail: clientEmail ?? '(missing)' },
            );
          }

          logger.log('Initializing Firebase with service-account credentials', {
            projectId,
            clientEmail,
          });

          app = initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey: config.get<string>('firebase.privateKey'),
            }),
          });
        }

        logger.log('Firebase Auth ready');
        return getAuth(app);
      },
    },
  ],
  exports: [FIREBASE_AUTH],
})
export class FirebaseModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    for (const app of getApps()) {
      logger.log('Deleting Firebase app on shutdown', { name: app.name });
      await deleteApp(app);
    }
  }
}
