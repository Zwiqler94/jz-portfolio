import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { DatabaseService } from './database.service';
import { HttpClient, HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { AppCheck } from '@angular/fire/app-check';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MockAuthService } from 'src/app/testing/mocks';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AnyPostResponse,
  PostBase,
  PostType,
} from 'src/app/components/models/post.model';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authService: MockAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useClass: MockAuthService },
        { provide: AppCheck, useValue: {} as AppCheck },
      ],
    });

    service = TestBed.inject(DatabaseService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as MockAuthService;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMainPosts issues request with AppCheck header', fakeAsync(() => {
    const mockPosts: AnyPostResponse[] = [
      {
        id: 1,
        title_or_uri: 'Hello',
        type: PostType.TextPost,
        content: 'Body',
        location: 'remote',
        title: 'Hello',
        uri: 'https://example.com',
      },
    ];

    let received: AnyPostResponse[] | undefined;

    service
      .getMainPosts()
      .pipe(take(1))
      .subscribe({
        next: (posts) => (received = posts),
        error: fail,
      });

    flushMicrotasks();

    const req = httpTestingController.expectOne(
      `${environment.serviceOptions.postService}/main`,
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('X-Firebase-AppCheck')).toBe(
      'mock-app-check-token',
    );
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockPosts);

    expect(received).toEqual(mockPosts);
  }));

  it('getMainPosts emits error when AppCheck token is missing', fakeAsync(() => {
    spyOn(authService, 'getAppCheckToken').and.resolveTo(undefined);
    let capturedError: Error | undefined;

    service
      .getMainPosts()
      .pipe(take(1))
      .subscribe({
        next: fail,
        error: (err) => (capturedError = err),
      });

    flushMicrotasks();

    expect(capturedError).toBeTruthy();
    expect(capturedError?.message).toContain('AppCheck token is missing');
  }));

  it(
    'createPost sends converted payload with AppCheck header to API',
    fakeAsync(() => {
      const post = {
        id: 42,
        title_or_uri: 'Original Title',
        type: PostType.TextPost,
        content: 'text',
        location: 'remote',
      };

      service.createPost(post as any).subscribe();
      flushMicrotasks();

      const req = httpTestingController.expectOne(
        (request) => request.url === environment.serviceOptions.postService,
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.params.get('local')).toBe('true');
      expect(req.request.headers.get('X-Firebase-AppCheck')).toBe(
        'mock-app-check-token',
      );
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.body).toEqual({
        title: 'Original Title',
        ...post,
      });
      req.flush({ ok: true });
    }),
  );

  it('savePreviewData posts preview payload with AppCheck header', fakeAsync(() => {
    const preview = {
      title: 'Preview',
      description: 'Desc',
      image: 'img.png',
      url: 'https://example.com',
    };

    service.savePreviewData(7, preview).subscribe();
    flushMicrotasks();

    const req = httpTestingController.expectOne(
      (request) => request.url === environment.serviceOptions.previewService,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X-Firebase-AppCheck')).toBe(
      'mock-app-check-token',
    );
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual({ id: 7, data: preview });
    req.flush({ ok: true });
  }));

  it(
    'getPreviewData fetches preview by id with AppCheck header',
    fakeAsync(() => {
      const response = { title: 'Cached', uri: 'https://example.com' };

      service.getPreviewData(9).subscribe((res) => {
        expect(res).toEqual(response);
      });
      flushMicrotasks();

      const req = httpTestingController.expectOne(
        `${environment.serviceOptions.previewService}/9`,
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('X-Firebase-AppCheck')).toBe(
        'mock-app-check-token',
      );
      req.flush(response);
    }),
  );

  it('handleError wraps HttpErrorResponse into user-facing error', (done) => {
    service
      .handleError(
        new HttpErrorResponse({
          status: 500,
          error: 'boom',
          statusText: 'Server Error',
          url: '/test',
        }),
      )
      .subscribe({
        next: () => done.fail('should error'),
        error: (err) => {
          expect(err.message).toContain('Something bad happened');
          done();
        },
      });
  });

  it('handleError handles client-side errors', (done) => {
    service
      .handleError(
        new HttpErrorResponse({
          status: 0,
          error: 'offline',
          statusText: 'Client Error',
          url: '/test',
        }),
      )
      .subscribe({
        next: () => done.fail('should error'),
        error: (err) => {
          expect(err.message).toContain('Something bad happened');
          done();
        },
      });
  });

  it('evaluates sorting values for every post type', () => {
    const svc = service as unknown as {
      getSortingValue(post: PostBase): string | number;
    };

    expect(
      svc.getSortingValue({
        id: 1,
        type: PostType.LinkPost,
        content: '',
        location: '',
        title_or_uri: '',
      }),
    ).toBe(1);
    expect(
      svc.getSortingValue({
        id: 2,
        type: PostType.TextPost,
        content: '',
        location: '',
        title_or_uri: '',
      }),
    ).toBe(2);

    const imageValue = svc.getSortingValue({
      id: 3,
      type: PostType.ImagePost,
      content: 'abc',
      location: '',
      title_or_uri: '',
      created_at: '2024-01-01T00:00:00.000Z',
    });
    expect(imageValue).toBeTruthy();

    expect(
      svc.getSortingValue({
        id: 4,
        type: PostType.VideoPost,
        content: 'xyz',
        location: '',
        title_or_uri: '',
      }),
    ).toBe('x');

    expect(
      svc.getSortingValue({
        id: 5,
        type: 'Unknown' as PostType,
        content: '',
        location: '',
        title_or_uri: '',
      }),
    ).toBe('');
  });
});
