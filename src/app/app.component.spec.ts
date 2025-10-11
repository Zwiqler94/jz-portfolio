import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { importProvidersFrom } from '@angular/core';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import {
  FirebaseApp,
  getApp,
  initializeApp,
  provideFirebaseApp,
} from '@angular/fire/app';
import { DatabaseService } from 'src/app/services/database/database.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  ReCaptchaV3Provider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';
import { provideRouter } from '@angular/router';

describe('AppComponent', () => {
  let app: FirebaseApp;

  let dbService: DatabaseService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => {
          const auth = getAuth();
          if (environment.local) {
            connectAuthEmulator(auth, 'http://localhost:9099', {
              disableWarnings: true,
            });
          }
          return auth;
        }),
        provideAppCheck(() =>
          initializeAppCheck(getApp(), {
            provider: new ReCaptchaV3Provider(environment.recaptchaSiteKey),
            isTokenAutoRefreshEnabled: true,
          }),
        ),
        importProvidersFrom(
          ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: false,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:20000',
          }),
        ),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', component: AppComponent }]),
      ],
    }).compileComponents();

    app = TestBed.inject(FirebaseApp);
    // dbService = TestBed.inject(DatabaseService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'jlz-portfolio'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('jlz-portfolio');
  });

  xit('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    // const button array
    expect(
      compiled.querySelector(
        '#button-container > button:nth-child(1) > span.mdc-button__label',
      ).textContent,
    ).toContain('Home');
    // #button-container > button:nth-child(3) > span.mdc-button__label
  });
});
