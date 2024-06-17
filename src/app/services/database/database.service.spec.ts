import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  ReCaptchaV3Provider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';

import { DatabaseService } from './database.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAppCheck(() =>
          initializeAppCheck(getApp(), {
            provider: new ReCaptchaV3Provider(environment.recaptchaSiteKey),
            isTokenAutoRefreshEnabled: true,
          }),
        ),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(DatabaseService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
