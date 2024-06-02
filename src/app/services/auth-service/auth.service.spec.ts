import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { RouterTestingHarness } from '@angular/router/testing';
import { ErrorPageComponent } from 'src/app/pages/error-page/error-page.component';
import { HomePageComponent } from 'src/app/pages/home-page/home-page.component';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  provideRouter,
} from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ReCaptchaV3Provider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';
import { LoginPageComponent } from 'src/app/pages/login-page/login-page.component';
import exp from 'constants';

function fakeRouterState(url: string): RouterStateSnapshot {
  return {
    url,
  } as RouterStateSnapshot;
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
          { path: 'login', component: LoginPageComponent },
          { path: '', component: LoginPageComponent },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be allowed route access if a user is not logged in and there is no uid for them', async () => {
    const harness = await RouterTestingHarness.create();
    const comp = await harness.navigateByUrl('/home', HomePageComponent);
    const spy = spyOn(service, 'canActivate').and.callThrough();

    const spy1 = spyOn(
      TestBed.inject(Router),
      'navigateByUrl',
    ).and.callThrough();
    service.uid = undefined;
    const x = service.canActivate(); //AuthGuard({} as ActivatedRouteSnapshot, fakeRouterState('home'));
    // await harness.navigateByUrl('/error', ErrorPageComponent);
    // await harness.navigateByUrl('/home', HomePageComponent);

    expect(spy).toHaveBeenCalled();
    expect(x).toBe(false);

    expect(spy1)
      .withContext('should go to login')
      .toHaveBeenCalledWith('/login');
  });
  it('should  be allowed route access if a user is  logged in and there is a uid for them', async () => {
    const harness = await RouterTestingHarness.create();
    const comp = await harness.navigateByUrl('/home', HomePageComponent);
    const spy = spyOn(service, 'canActivate').and.callThrough();

    const spy1 = spyOn(
      TestBed.inject(Router),
      'navigateByUrl',
    ).and.callThrough();
    service.uid = 'mooie';
    const x = service.canActivate(); //AuthGuard({} as ActivatedRouteSnapshot, fakeRouterState('home'));
    // await harness.navigateByUrl('/error', ErrorPageComponent);
    // await harness.navigateByUrl('/home', HomePageComponent);

    expect(spy).toHaveBeenCalled();
    expect(x).toBeTrue();

    expect(spy1).withContext('should go to login').toHaveBeenCalledTimes(0);
  });

  it('should clear uid and user token on logout and go to login page', async () => {
    const harness = await RouterTestingHarness.create();
    const comp = await harness.navigateByUrl('/home', HomePageComponent);
    const spy = spyOn(service, 'logout').and.callThrough();

    const spy1 = spyOn(
      TestBed.inject(Router),
      'navigateByUrl',
    ).and.callThrough();
    service.uid = 'mooie';
    service.userToken = 'eynsDNFigfnovnosdinvoisnv9024ur98ghn39io';
    service.logout();

    expect(spy).toHaveBeenCalled();
    expect(service.uid).toBeUndefined();
    expect(service.userToken).toBeUndefined();
    expect(spy1)
      .withContext('should go to login')
      .toHaveBeenCalledWith('/login');
  });
});
