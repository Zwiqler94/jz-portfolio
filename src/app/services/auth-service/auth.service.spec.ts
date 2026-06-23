import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AppCheck } from '@angular/fire/app-check';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import * as appCheckModule from '@angular/fire/app-check';

class RouterStub {
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}

class AuthStub {
  currentUser: { uid: string } | null = null;
  signOut = jasmine.createSpy('signOut').and.returnValue(Promise.resolve());
}

describe('AuthService', () => {
  let service: AuthService;
  let router: RouterStub;
  let auth: AuthStub;
  let appCheck: AppCheck;

  beforeEach(() => {
    router = new RouterStub();
    auth = new AuthStub();
    appCheck = {} as AppCheck;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: Auth, useValue: auth },
        { provide: AppCheck, useValue: appCheck },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    router.navigateByUrl.calls.reset();
    auth.signOut.calls.reset();
  });

  it('allows route activation when a uid is present', () => {
    service.uid = 'uid-123';

    expect(service.canActivate()).toBeTrue();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('redirects to login when no uid is available', () => {
    service.uid = undefined;

    expect(service.canActivate()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('clears auth state and navigates on logout', () => {
    service.uid = 'uid-123';
    service.userToken = 'token';
    service.appCheckToken = 'check';
    service.isLoggedIn = true;

    service.logout();

    expect(auth.signOut).toHaveBeenCalled();
    expect(service.uid).toBeUndefined();
    expect(service.userToken).toBeUndefined();
    expect(service.appCheckToken).toBeUndefined();
    expect(service.isLoggedIn).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('fetches an App Check token when the Firebase user exists', async () => {
    auth.currentUser = { uid: 'uid-123' };
    const tokenSpy = spyOn(appCheckModule, 'getToken').and.returnValue(
      Promise.resolve({ token: 'app-check-token' } as any),
    );

    const token = await service.getAppCheckToken('spec');

    expect(tokenSpy).toHaveBeenCalledWith(appCheck);
    expect(token?.token).toBe('app-check-token');
  });

  it('skips App Check token retrieval when there is no Firebase user', async () => {
    auth.currentUser = null;
    const tokenSpy = spyOn(appCheckModule, 'getToken').and.returnValue(
      Promise.resolve({ token: 'unused' } as any),
    );

    const token = await service.getAppCheckToken('spec');

    expect(token).toBeUndefined();
    expect(tokenSpy).not.toHaveBeenCalled();
  });

  it('handleError surfaces client-side failures', (done) => {
    const error = new HttpErrorResponse({
      status: 0,
      statusText: 'CLIENT',
      error: 'offline',
      url: '/test',
    });

    service.handleError(error).subscribe({
      error: (err) => {
        expect(err.message).toContain('Something bad happened');
        done();
      },
    });
  });

  it('handleError surfaces server-side failures', (done) => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'SERVER',
      error: { message: 'broken' },
      url: '/test',
    });

    service.handleError(error).subscribe({
      error: (err) => {
        expect(err.message).toContain('Something bad happened');
        done();
      },
    });
  });
});
