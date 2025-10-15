import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';
import { EverythingBaseComponent } from '@zwiqler94/everything-lib';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectsComponent, EverythingBaseComponent],
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
        /* This code snippet is providing the App Check feature in an Angular application using
        Firebase. */
        // provideAppCheck(() =>
        //   initializeAppCheck(getApp(), {
        //     provider: new ReCaptchaEnterpriseProvider(environment.recaptchaSiteKey),
        //     isTokenAutoRefreshEnabled: true,
        //   }),
        // ),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
