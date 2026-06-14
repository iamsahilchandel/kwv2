import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
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
          app = existing[0];
        } else if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
          // FIREBASE_AUTH_EMULATOR_HOST is automatically read by the SDK;
          // only projectId is required — no real credentials needed for emulator.
          app = initializeApp({ projectId: process.env.GCLOUD_PROJECT });
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          // SDK reads the JSON key file from GOOGLE_APPLICATION_CREDENTIALS automatically.
          app = initializeApp({ credential: applicationDefault() });
        } else {
          // Explicit service-account credentials from environment variables.
          app = initializeApp({
            credential: cert({
              projectId: config.get<string>('firebase.projectId'),
              clientEmail: config.get<string>('firebase.clientEmail'),
              privateKey: config.get<string>('firebase.privateKey'),
            }),
          });
        }

        return getAuth(app);
      },
    },
  ],
  exports: [FIREBASE_AUTH],
})
export class FirebaseModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    for (const app of getApps()) {
      await deleteApp(app);
    }
  }
}
