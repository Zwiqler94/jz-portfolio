import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPageComponent } from './error-page.component';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { HomePageComponent } from 'src/app/pages/home-page/home-page.component';
import { importProvidersFrom } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAppCheck } from '@angular/fire/app-check';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorPageComponent],
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
        provideRouter([
          {
            path: 'home',
            component: HomePageComponent,
          },
          { path: '**', component: ErrorPageComponent },
        ]),
        provideAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home page', async () => {
    const harness = await RouterTestingHarness.create('error');
    const comp = await harness.navigateByUrl('error', ErrorPageComponent);

    const spy = spyOn(comp, 'goHome').and.callThrough();
    await comp.goHome();
    expect(spy).toHaveBeenCalled();
    expect(TestBed.inject(Router).url)
      .withContext('should go home')
      .toBe('/home');
  });
});
