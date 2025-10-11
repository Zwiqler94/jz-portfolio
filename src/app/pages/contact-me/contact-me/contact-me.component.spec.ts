import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMeComponent } from './contact-me.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAppCheck } from '@angular/fire/app-check';
import { getApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { environment } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

describe('ContactMeComponent', () => {
  let component: ContactMeComponent;
  let fixture: ComponentFixture<ContactMeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactMeComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideHttpClient(),
        provideHttpClientTesting(),
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
      ],
    });
    fixture = TestBed.createComponent(ContactMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
