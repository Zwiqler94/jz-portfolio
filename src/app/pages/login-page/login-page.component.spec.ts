import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Auth, Unsubscribe } from '@angular/fire/auth';
import * as authModule from '@angular/fire/auth';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MockAuthService } from 'src/app/testing/mocks';

class RouterStub {
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}

class MockFirebaseAuth {
  currentUser: unknown = null;
  private listeners: ((user: unknown) => void)[] = [];
  setPersistence = jasmine
    .createSpy('setPersistence')
    .and.returnValue(Promise.resolve());

  onAuthStateChanged(callback: (user: unknown) => void): Unsubscribe {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback,
      );
    };
  }

  emit(user: unknown) {
    this.listeners.forEach((listener) => listener(user));
  }
}

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let router: RouterStub;
  let mockFirebaseAuth: MockFirebaseAuth;
  let authService: MockAuthService;

  beforeEach(async () => {
    router = new RouterStub();
    mockFirebaseAuth = new MockFirebaseAuth();

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: Auth, useValue: mockFirebaseAuth },
        { provide: AuthService, useClass: MockAuthService },
      ],
    })
      .overrideComponent(LoginPageComponent, {
        set: {
          template: '<button (click)="signIn()">Login</button>',
          imports: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as MockAuthService;
    fixture.detectChanges();
  });

  it('navigates to the home page when Firebase emits a logged-in user', () => {
    mockFirebaseAuth.emit({
      uid: 'uid-123',
      displayName: 'Tester',
    } as any);

    expect(authService.uid).toBe('uid-123');
    expect(authService.isLoggedIn).toBeTrue();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('clears auth state when the Firebase user signs out', () => {
    authService.uid = 'uid-123';
    authService.isLoggedIn = true;

    mockFirebaseAuth.emit(null);

    expect(authService.uid).toBeUndefined();
    expect(authService.isLoggedIn).toBeFalse();
    expect(authService.appCheckToken).toBeUndefined();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('signs the user in via Google and stores app-check tokens', async () => {
    const signInSpy = spyOn(authModule, 'signInWithPopup').and.returnValue(
      Promise.resolve({
        user: {
          uid: 'uid-123',
          displayName: 'Tester',
        },
      } as any),
    );
    const tokenSpy = spyOn(authService, 'getAppCheckToken').and.resolveTo({
      token: 'app-check-token',
    });

    await component.signIn();
    await fixture.whenStable();

    expect(signInSpy).toHaveBeenCalled();
    expect(tokenSpy).toHaveBeenCalledWith('login:signin');
    expect(authService.uid).toBe('uid-123');
    expect(authService.appCheckToken).toBe('app-check-token');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('logs errors when Google sign-in fails', async () => {
    const error = {
      code: 'auth/failure',
      message: 'popup blocked',
      customData: { email: 'test@example.com' },
    };
    spyOn(authModule, 'signInWithPopup').and.returnValue(Promise.reject(error));
    const consoleSpy = spyOn(console, 'error');

    await component.signIn();
    await fixture.whenStable();

    expect(consoleSpy).toHaveBeenCalled();
  });
});
