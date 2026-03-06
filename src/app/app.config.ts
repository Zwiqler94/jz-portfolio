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
import { provideGalleryOptions } from 'ngx-gallery-jz';
import { provideLightboxOptions } from 'ngx-gallery-jz/lightbox';
import { environment } from '../environments/environment';
import { routes } from 'src/app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';

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
    provideLightboxOptions({
      exitAnimationTime: 1000,
      keyboardShortcuts: true,
    }),
    provideGalleryOptions({
      imageSize: 'contain',
      resizeDebounceTime: 30,
      centralized: true,
      debug: true,
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideCloudinaryLoader('https://res.cloudinary.com/dhdioy0wn'),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAppCheck(() =>
      initializeAppCheck(getApp(), {
        provider: new ReCaptchaEnterpriseProvider(environment.recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      }),
    ),
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
