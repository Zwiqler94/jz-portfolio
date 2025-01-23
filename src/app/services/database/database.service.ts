import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApplicationRef, Injectable, inject } from '@angular/core';
import { AppCheck } from '@angular/fire/app-check';
import { DateTime } from 'luxon';
import {
  Observable,
  catchError,
  throwError,
  from,
  switchMap,
  retry,
  repeat,
} from 'rxjs';
import {
  AnyPost,
  AnyPostResponse,
  LinkPreview,
  PostBase,
} from 'src/app/components/models/post.model';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  appRef = inject(ApplicationRef);

  appCheck = inject(AppCheck);

  private _mainPosts: Observable<AnyPost[]>;
  puppyPosts: Observable<AnyPost[]>;
  articlePosts: Observable<AnyPost[]>;
  applePosts: Observable<AnyPost[]>;
  animePosts: Observable<AnyPost[]>;
  blockchainPosts: Observable<AnyPost[]>;

  postUrl = environment.serviceOptions.postService;
  previewUrl = environment.serviceOptions.previewService;

  headers: HttpHeaders = new HttpHeaders();

  getMainPosts(): Observable<AnyPostResponse[]> {
    return from(this.authService.getAppCheckToken('db:urls')).pipe(
      switchMap((appCheckResponse) => {
        const appCheckToken = appCheckResponse?.token;

        if (!appCheckToken) {
          throw new Error('AppCheck token is missing.');
        }

        // Set headers
        this.headers = new HttpHeaders({
          'X-Firebase-AppCheck': appCheckToken,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        });

        console.debug(this.headers); // Optionally remove in production

        // Make HTTP request
        return this.httpClient.get<AnyPostResponse[]>(
          `${this.postUrl}/main_feed`,
          {
            headers: this.headers,
            // params: { local: true },
          },
        );
      }),
      retry(3),
      repeat({ delay: 12000 }),
      // map((posts) => this.nextFn(posts)), // Process the response
      catchError((error) => {
        console.error('Error fetching main posts:', error);
        return throwError(() => error); // Propagate the error as an Observable
      }),
    );
  }

  handleError = (error: HttpErrorResponse) => {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.message, error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () =>
        new Error(
          `Something bad happened; please try again later. ${error.type} Error Message: ${error.message} `,
        ),
    );
  };

  createPost(post: AnyPost) {
    const convertForBe = {
      title: post.title_or_uri,
      ...post,
    };
    this.headers = this.headers
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.httpClient.post(`${this.postUrl}`, convertForBe, {
      headers: this.headers,
      params: { local: true },
    });
  }

  savePreviewData(id: number, data: LinkPreview) {
    this.headers = this.headers
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.httpClient.post(
      `${this.previewUrl}`,
      { id, data },
      {
        headers: this.headers,
        params: { local: true },
      },
    );
  }

  getPreviewData(id: number) {
    this.headers = this.headers
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.httpClient.get<any>(`${this.previewUrl}/${id}`, {
      headers: this.headers,
    });
  }

  private nextFn(posts: PostBase[]): PostBase[] {
    return posts.sort((a, b) => {
      // Get values for comparison
      const aVal = this.getSortingValue(a);
      const bVal = this.getSortingValue(b);

      console.log(aVal, bVal);
      const sort1 = aVal < bVal ? 1 : 0;

      // Compare values
      return aVal > bVal ? -1 : sort1;
    });
  }

  private getSortingValue(post: PostBase): string | DateTime | number {
    // Handle sorting based on type
    switch (post.type) {
      case 'LinkPost':
      case 'TextPost':
        return post.id;

      case 'ImagePost':
      case 'VideoPost':
        return post.created_at
          ? DateTime.fromISO(post.created_at)
          : post.content.charAt(0);

      default:
        return '';
    }
  }
}
