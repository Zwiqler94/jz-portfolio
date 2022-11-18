import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

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
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    MatTabsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
