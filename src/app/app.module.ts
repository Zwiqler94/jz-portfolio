import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import {
  CustomProvider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AppComponent } from './app.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { HobbiesComponent } from './pages/hobbies/hobbies.component';
import { NewsComponent } from './pages/news/news.component';
import { SocialsComponent } from './pages/socials/socials.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { FeedComponent } from './components/feed/feed.component';
import { MainFeedPageComponent } from './pages/main-feed-page/main-feed-page.component';
import { TextPostComponent } from './components/text-post/text-post.component';
import { LinkPostComponent } from './components/link-post/link-post.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
// import {
//   app,
//   initializeApp as adminInitializeApp,
//   credential,
// } from 'firebase-admin';

// export const FIREBASE_ADMIN = new InjectionToken<app.App>('firebase-admin');
// declare global {
//   // eslint-disable-next-line no-var
//   var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
// }

// self.FIREBASE_APPCHECK_DEBUG_TOKEN = 'true';

// const firebaseAdminApp = adminInitializeApp({credential: credential.applicationDefault()});
// const appCheckToken = firebaseAdminApp
//   .appCheck()
//   .createToken(environment.firebaseConfig.appId, {
//     ttlMillis: 604_800_000,
//   })
//   .then(({ token, ttlMillis: expireTimeMillis }) => ({
//     token,
//     expireTimeMillis,
//   }));
@NgModule({
  declarations: [
    AppComponent,
    AboutMeComponent,
    HobbiesComponent,
    NewsComponent,
    SocialsComponent,
    ErrorPageComponent,
    FeedComponent,
    MainFeedPageComponent,
    TextPostComponent,
    LinkPostComponent,
    CarouselComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    MatInputModule,
    MatTabsModule,
    MatListModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    // provideAppCheck(() => {
    //   const provider = new CustomProvider({
    //     getToken: () => appCheckToken,
    //   });
    //   return initializeAppCheck(undefined, {
    //     provider,
    //     isTokenAutoRefreshEnabled: false,
    //   });
    // }),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
