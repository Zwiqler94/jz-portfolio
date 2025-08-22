/// <reference types="@angular/localize" />

import { importProvidersFrom, isDevMode } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { bootstrapApplication } from '@angular/platform-browser';
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
import { GALLERY_CONFIG, GalleryConfig, GalleryModule } from 'ng-gallery';
import {
  LIGHTBOX_CONFIG,
  LightboxConfig,
  LightboxModule,
} from 'ng-gallery/lightbox';
import { IMAGE_CONFIG, provideCloudinaryLoader } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { setLogLevel, LogLevel } from '@angular/fire';

setLogLevel(LogLevel.VERBOSE);

bootstrapApplication(AppComponent, {
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
    provideCloudinaryLoader('https://res.cloudinary.com/dhdioy0wn'),
    importProvidersFrom(
      GalleryModule,
      LightboxModule,
    ),
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
      console.log(`Running in live site: ${!environment.local}`)
      if (environment.local) {
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
      }
      return auth;
    }),
    provideAnimations(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
    ),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.serviceOptions.useServiceWorker && !environment.local && !isDevMode(),
      registrationStrategy: 'registerWhenStable:20000',
    })
  ],
}).catch((err) => console.error(err));
