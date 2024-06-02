import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPostComponent } from './link-post.component';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import {
  ReCaptchaV3Provider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';
import { from, of, throwError } from 'rxjs';
import { title } from 'process';
import { MissingLinkPreviewData } from 'src/app/components/models/post.model';

describe('LinkPostComponent', () => {
  let component: LinkPostComponent;
  let fixture: ComponentFixture<LinkPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkPostComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.type).toBe('LinkPost');
  });

  it('should return a link preview obj', async () => {
    component.content =
      'https://www.googletagmanager.com/ns.html?id=GTM-KWH754TK';
    const spy = spyOn(
      LinkPreviewService.prototype,
      'getLinkPreview',
    ).and.resolveTo(of({ title: 'c', description: 'd', image: 'fm', url: '' }));

    await component.getLinkPreview();

    expect(component.linkPreviewData).toEqual({
      title: 'c',
      description: 'd',
      image: 'fm',
      url: '',
    });
  });

  it('should throw error if something bad happens with link preview service', async () => {
    component.content =
      'https://www.googletagmanager.com/ns.html?id=GTM-KWH754TK';
    const spy = spyOn(
      LinkPreviewService.prototype,
      'getLinkPreview',
    ).and.resolveTo(throwError(() => 'Meep'));

    await component.getLinkPreview();

    expect(component.title).toBe(MissingLinkPreviewData.title);
    expect(component.content).toBe(MissingLinkPreviewData.description);
  });
});
