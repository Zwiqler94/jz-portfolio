import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsComponent } from './news.component';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  ReCaptchaV3Provider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsComponent],
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
