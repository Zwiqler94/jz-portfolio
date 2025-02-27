import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAppCheck } from '@angular/fire/app-check';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
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
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
