import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { RouterTestingHarness } from '@angular/router/testing';
import { HomePageComponent } from 'src/app/pages/blog-page/blog-page.component';
import { Router, RouterStateSnapshot, provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  AppCheck,
  ReCaptchaV3Provider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';
import * as appCheck from '@angular/fire/app-check';

import { LoginPageComponent } from 'src/app/pages/login-page/login-page.component';
import Sinon, { stub } from 'sinon';

function fakeRouterState(url: string): RouterStateSnapshot {
  return {
    url,
  } as RouterStateSnapshot;
}

describe('AuthService', () => {
  let service: AuthService;
  let appCheckService: AppCheck;

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
    appCheckService = TestBed.inject(AppCheck);
    const httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    Sinon.restore();
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

  xit('should call app-check getToken', async () => {
    // const harness = await RouterTestingHarness.create();
    // const comp = await harness.navigateByUrl('/home', HomePageComponent);
    environment.local = false;

    service.isLoggedIn = true;

    // const spy2 = spyOnProperty(appCheckService, 'app').and.returnValue({
    //   name: '',
    //   options: {},
    //   automaticDataCollectionEnabled: false
    // });

    console.log({
      env: environment.local,
      ac: service.appCheck ? 'defined' : undefined,
    });

    const fakeAppCheck = {
      getToken: async () => {
        return { token: '' };
      },
    };

    const fakeSpy = stub(appCheck, 'getToken'); //.resolves({ token:''});
    // service.uid = 'mooie';
    // service.userToken = 'eynsDNFigfnovnosdinvoisnv9024ur98ghn39io';
    // service.logout();
    try {
      await service.getAppCheckToken('moose');
      expect(fakeSpy).toBe(1);
    } catch (err) {
      console.error(err);
    }
    // expect(spy2).toBeDefined()
  });

  xit('should trigger error Handler', async () => {
    // const harness = await RouterTestingHarness.create();
    // const comp = await harness.navigateByUrl('/home', HomePageComponent);
    // environment.local = false;

    const spy = spyOn(service, 'getAppCheckToken').and.rejectWith(undefined);

    // const fakeAppCheck = {
    //   getToken: appCheck.getToken,
    // };

    await service.getAppCheckToken('moose');

    // const spy1 = spyOn(fakeAppCheck, 'getToken').and.resolveTo();
    // service.uid = 'mooie';
    // service.userToken = 'eynsDNFigfnovnosdinvoisnv9024ur98ghn39io';
    // service.logout();

    expect(spy).toThrowError();
  });
});
