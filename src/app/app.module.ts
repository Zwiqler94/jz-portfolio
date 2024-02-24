import { NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { EverythingLibModule } from '@zwiqler94/everything-lib'
import { NgxEditorModule } from 'ngx-editor';

import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  AppCheck,
  ReCaptchaV3Provider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';

import { provideAnalytics, initializeAnalytics } from '@angular/fire/analytics';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

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
import { LoginPageComponent } from 'src/app/pages/login-page/login-page.component';
import { PostBaseComponent } from 'src/app/components/post-base/post-base.component';
import { ContactMeComponent } from 'src/app/pages/contact-me/contact-me/contact-me.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutMeMainComponent } from './pages/about-me/about-me-main/about-me-main.component';
import { ProjectsComponent } from './pages/about-me/projects/projects.component';
import { SkillsComponent } from './pages/about-me/skills/skills.component';
import { CredentialsComponent } from './pages/about-me/credentials/credentials.component';
import { JzTabGroupComponent } from './components/jz-tab/jz-tab-group.component';
import { JzTabItemComponent } from './components/jz-tab-item/jz-tab-item.component';
import { EditorPageComponent } from './pages/editor-page/editor-page.component';
import { JapaneseTabComponent } from './pages/hobbies/japanese-tab/japanese-tab.component';
import { PhotographyTabComponent } from './pages/hobbies/photography-tab/photography-tab.component';
import { FitnessTabComponent } from './pages/hobbies/fitness-tab/fitness-tab.component';
import { DatabaseService } from 'src/app/services/database/database.service';
import { NewPostDialogComponent } from './components/new-post-dialog/new-post-dialog.component';
import { NgxColorsModule } from 'ngx-colors';

declare global {
  // eslint-disable-next-line no-var
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
}

self.FIREBASE_APPCHECK_DEBUG_TOKEN = environment.appCheckDebug;

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
    PostBaseComponent,
    CarouselComponent,
    LoginPageComponent,
    ContactMeComponent,
    FooterComponent,
    AboutMeMainComponent,
    ProjectsComponent,
    SkillsComponent,
    CredentialsComponent,
    JzTabGroupComponent,
    JzTabItemComponent,
    EditorPageComponent,
    JapaneseTabComponent,
    PhotographyTabComponent,
    FitnessTabComponent,
    NewPostDialogComponent,
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
    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.serviceOptions.useServiceWorker,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:20000',
    }),
    CdkDrag,
    CdkDragHandle,
    EverythingLibModule,
    NgxEditorModule,
    MatDialogModule,
    NgxColorsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private dbService: DatabaseService) {
    this.dbService.appCheck = inject(AppCheck);
  }
}
