/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { NgxColorsModule } from 'ngx-colors';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxEditorModule } from 'ngx-editor';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { provideHttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideAnalytics, initializeAnalytics } from '@angular/fire/analytics';
import { provideStorage, getStorage } from '@angular/fire/storage';
import {
  provideAppCheck,
  initializeAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { GALLERY_CONFIG, GalleryConfig } from 'ng-gallery';
import { LIGHTBOX_CONFIG, LightboxConfig } from 'ng-gallery/lightbox';
import { IMAGE_CONFIG, provideCloudinaryLoader } from '@angular/common';

if (environment.production) {
  enableProdMode();
}

// declare global {
//   // eslint-disable-next-line no-var
//   var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
// }

// self.FIREBASE_APPCHECK_DEBUG_TOKEN = environment.appCheckDebug;

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
      MatButtonModule,
      MatSnackBarModule,
      MatFormFieldModule,
      MatToolbarModule,
      MatCardModule,
      MatInputModule,
      MatTabsModule,
      MatListModule,
      MatChipsModule,
      FormsModule,
      ReactiveFormsModule,
      MatSidenavModule,
      MatSelectModule,
      MatExpansionModule,
      MatIconModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.serviceOptions.useServiceWorker,
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:20000',
      }),
      CdkDrag,
      CdkDragHandle,
      NgxEditorModule,
      MatDialogModule,
      NgxColorsModule,
    ),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAppCheck(() =>
      initializeAppCheck(getApp(), {
        provider: new ReCaptchaV3Provider(environment.recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      }),
    ),
    provideStorage(() => getStorage()),
    provideAnalytics(() => initializeAnalytics(getApp())),
    provideAuth(() => {
      const auth = getAuth();
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
  ],
}).catch((err) => console.error(err));
