import {
  TestBed,
  fakeAsync,
  flushMicrotasks,
  tick,
} from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { LinkPreviewService } from './link-preview.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MockAuthService } from 'src/app/testing/mocks';
import { environment } from 'src/environments/environment';
import { LinkPreview } from 'src/app/components/models/post.model';

describe('LinkPreviewService', () => {
  let service: LinkPreviewService;
  let httpMock: HttpTestingController;
  let authService: MockAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LinkPreviewService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    service = TestBed.inject(LinkPreviewService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as MockAuthService;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAPIKey makes authenticated request when token present', fakeAsync(() => {
    authService.appCheckToken = 'token';
    let response: { k: string } | undefined;
    service.getAPIKey().subscribe((res) => (response = res));

    const req = httpMock.expectOne(
      (request) =>
        request.url ===
        `${environment.serviceOptions.secretService}/link-previews`,
    );
    expect(req.request.headers.get('X-Firebase-AppCheck')).toBe('token');
    expect(req.request.params.get('prod')).toBe(String(environment.production));
    req.flush({ k: 'secret' });
    tick(2500);
    expect(response).toEqual({ k: 'secret' });
  }));

  it('getAPIKey fetches AppCheck token when none is cached', fakeAsync(() => {
    authService.appCheckToken = undefined;
    spyOn(authService, 'getAppCheckToken').and.resolveTo({
      token: 'fresh-token',
    });
    let response: { k: string } | undefined;

    service.getAPIKey().subscribe((res) => (response = res));
    flushMicrotasks();

    const req = httpMock.expectOne(
      (request) =>
        request.url ===
        `${environment.serviceOptions.secretService}/link-previews`,
    );
    expect(req.request.headers.get('X-Firebase-AppCheck')).toBe('fresh-token');
    expect(authService.appCheckToken as string | undefined).toBe('fresh-token');
    req.flush({ k: 'secret' });
    tick(2500);
    expect(response).toEqual({ k: 'secret' });
  }));

  it('getLinkPreview requests preview when apiKey and token exist', fakeAsync(() => {
    authService.appCheckToken = 'token';
    service.apiKey = 'preview-key';
    const previewUrl = 'https://example.com';
    let preview: LinkPreview | undefined;

    service
      .getLinkPreview(previewUrl)
      .subscribe((result) => (preview = result));

    const req = httpMock.expectOne(
      (request) => request.url === 'https://api.linkpreview.net/',
    );
    expect(req.request.params.get('key')).toBe('preview-key');
    expect(req.request.params.get('q')).toBe(previewUrl);
    expect(req.request.headers.get('X-Firebase-AppCheck')).toBe('token');

    const payload: LinkPreview = {
      title: 'Title',
      description: 'Desc',
      image: 'img.png',
      url: previewUrl,
    };
    req.flush(payload);
    tick(15000);

    expect(preview).toEqual(payload);
  }));

  it('getLinkPreview fetches and caches API key when missing', fakeAsync(() => {
    authService.appCheckToken = 'token';
    const previewUrl = 'https://example.com';
    let preview: LinkPreview | undefined;

    service
      .getLinkPreview(previewUrl)
      .subscribe((result) => (preview = result));

    const keyReq = httpMock.expectOne(
      (request) =>
        request.url ===
        `${environment.serviceOptions.secretService}/link-previews`,
    );
    expect(keyReq.request.headers.get('X-Firebase-AppCheck')).toBe('token');
    keyReq.flush({ k: 'fetched-key' });
    tick(2500);

    const previewReq = httpMock.expectOne(
      (request) => request.url === 'https://api.linkpreview.net/',
    );
    expect(previewReq.request.params.get('key')).toBe('fetched-key');
    expect(previewReq.request.params.get('q')).toBe(previewUrl);

    const payload: LinkPreview = {
      title: 'Title',
      description: 'Desc',
      image: 'img.png',
      url: previewUrl,
    };
    previewReq.flush(payload);
    tick(15000);

    expect(preview).toEqual(payload);
    expect(service.apiKey).toBe('fetched-key');
  }));

  it('getLinkPreview returns observable error when AppCheck token is missing', fakeAsync(() => {
    service.apiKey = 'preview-key';
    authService.appCheckToken = undefined;
    spyOn(authService, 'getAppCheckToken').and.resolveTo({
      token: undefined,
    } as any);
    let error: Error | undefined;

    service.getLinkPreview('https://example.com').subscribe({
      error: (err) => (error = err),
    });
    flushMicrotasks();

    expect(error?.message).toContain('AppCheck token is missing');
  }));
});
