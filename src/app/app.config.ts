import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideAnalytics, initializeAnalytics } from '@angular/fire/analytics';
import { provideStorage, getStorage } from '@angular/fire/storage';
import {
  provideAppCheck,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from '@angular/fire/app-check';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { IMAGE_CONFIG, provideCloudinaryLoader } from '@angular/common';
import { setLogLevel, LogLevel } from '@angular/fire';
import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import { routes } from 'src/app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { getFunctions, provideFunctions } from '@angular/fire/functions';

setLogLevel(LogLevel.VERBOSE);

declare global {
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
  var __NG_GALLERY_DEBUG: boolean;
}

self.FIREBASE_APPCHECK_DEBUG_TOKEN = isDevMode()
  ? environment.appCheckDebug
  : false;

self.__NG_GALLERY_DEBUG = true;

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: IMAGE_CONFIG,
      useValue: {
        breakpoints: [
          16, 24, 32, 48, 64, 96, 128, 160, 224, 256, 288, 384, 512, 640, 750,
          828, 1080, 1200, 1365, 1500, 1648, 1920,
        ],
      },
    },
    {
      provide: LIGHTBOX_CONFIG,
      useValue: {
        keyboardShortcuts: true,
        exitAnimationTime: 1000,
      } as LightboxConfig,
    },
    {
      provide: GALLERY_CONFIG,
      useValue: {
        // autoHeight: true,
        // itemAutosize: true,
        // imageSize: 'contain',
      } as GalleryConfig,
    },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideCloudinaryLoader('https://res.cloudinary.com/dhdioy0wn'),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirebaseApp(() =>
      initializeApp(
        {
          apiKey: 'AIzaSyDz1gmfYWryGMken3i1bVfNQP2tha3vIi8',
          authDomain: 'usernamegenerator.firebaseapp.com',
          projectId: 'usernamegenerator',
          storageBucket: 'usernamegenerator.firebasestorage.app',
          messagingSenderId: '853416854561',
          appId: '1:853416854561:web:ce4ad92e0ba115925e8f60',
        },
        'usernamegenerator',
      ),
    ),
    provideAppCheck(() =>
      initializeAppCheck(getApp(), {
        provider: new ReCaptchaEnterpriseProvider(environment.recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      }),
    ),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => initializeAnalytics(getApp())),
    provideAuth(() => {
      const auth = getAuth();
      console.log(`Running in live site: ${!environment.local}`);
      if (environment.local && isDevMode()) {
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
      }
      return auth;
    }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
    ),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled:
        environment.serviceOptions.useServiceWorker &&
        !environment.local &&
        !isDevMode(),
      registrationStrategy: 'registerWhenStable:20000',
    }),
  ],
};
