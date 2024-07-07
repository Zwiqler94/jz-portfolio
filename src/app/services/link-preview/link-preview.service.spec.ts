import { TestBed } from '@angular/core/testing';

import { LinkPreviewService } from './link-preview.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  ReCaptchaV3Provider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import sinon from 'sinon';
// const quibble = require('quibble');

describe('LinkPreviewService', () => {
  let service: LinkPreviewService;

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
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(LinkPreviewService);
  });

  afterEach(() => {
    sinon.restore();
    // quibble.reset();
  });

  it('should be created with appCheck service', () => {
    expect(service).toBeTruthy();
    expect(service.appCheck).toBeDefined();
  });

  // it('should get an app check token', async () => {
  //   let stub: sinon.SinonSpy<any[], any>, getToken;
  //   beforeEach(() => {
  //      stub = sinon.fake.resolves({ token: 'DODODOD' });
  //      quibble.esm(
  //       '@angular/fire/app-check',
  //       { getToken: () => stub },
  //       'getToken'
  //     );
  //   });

  //   const spy = sinon.spy(service, 'getAppCheckToken');
  //   const res: AppCheckToken =
  //     (await service.getAppCheckToken()) as AppCheckToken;
  //   expect(spy).toHaveBeenCalled();
  //   expect(res.token).toBe('DODODOD');
  // });
});
