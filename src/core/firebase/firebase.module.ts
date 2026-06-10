import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  initializeApp,
  getApps,
  deleteApp,
  cert,
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
        const app: App =
          existing.length > 0
            ? existing[0]
            : initializeApp({
                credential: cert({
                  projectId: config.get<string>('firebase.projectId'),
                  clientEmail: config.get<string>('firebase.clientEmail'),
                  privateKey: config.get<string>('firebase.privateKey'),
                }),
              });
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
