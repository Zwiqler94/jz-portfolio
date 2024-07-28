import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ApplicationRef, Injectable, inject } from '@angular/core';
import { AppCheck } from '@angular/fire/app-check';
import { DateTime } from 'luxon';
import { Observable, catchError, map, of, throwError, first } from 'rxjs';
import { Post } from 'src/app/components/models/post.model';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { staticTextPosts } from 'src/app/services/database/posts';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _mainPosts: Observable<Post[]>;
  puppyPosts: Observable<Post[]>;
  articlePosts: Observable<Post[]>;
  applePosts: Observable<Post[]>;
  animePosts: Observable<Post[]>;
  blockchainPosts: Observable<Post[]>;

  postUrl = environment.serviceOptions.postService;
  _appCheck: AppCheck | undefined;
  // tokenResult: string;

  headers: HttpHeaders = new HttpHeaders();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    appRef: ApplicationRef,
  ) {
    this.appCheck = inject(AppCheck);

    const appIsStable$ = appRef.isStable.pipe(
      first((isStable) => isStable === true),
    );

    if (environment.local && typeof environment.appCheckDebug === 'string') {
      console.debug('IN DEBUG MODE');
      if (!this.authService.appCheckToken)
        this.authService.getAppCheckToken('db:constructor').then((val) => {
          val
            ? (this.authService.appCheckToken = val.token)
            : (this.authService.appCheckToken = undefined);
        });
    }

    // this.setDBUrls();

    // if (!this.authService.appCheckToken) {
    //   this.authService.getAppCheckToken().subscribe((authToken) => {
    //     this.authService.appCheckToken = authToken.token;
    //   });
    // }
  }

  get appCheck() {
    return this._appCheck;
  }

  set appCheck(x) {
    this._appCheck = x;
  }

  // async getAppCheckToken(): Promise<string | AppCheckTokenResult | undefined> {
  //   try {
  //     if (!environment.local && this.appCheck) {
  //       this.tokenResult = (await getToken(this.appCheck, false)).token;
  //       // console.debug(this.tokenResult);
  //     } else {
  //       return '';
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   return this.tokenResult;
  // }

  // private async setDBUrls() {
  //   // if (!this.authService.appCheckToken) {
  //   // this.authService.getAppCheckToken('db:urls').then((tokenResult) => {
  //   this.authService.appCheckToken = (
  //     await this.authService.getAppCheckToken('db:urls')
  //   )?.token; //tokenResult?.token;
  //   // });
  //   // }

  //   // if (this.authService.appCheckToken) {
  //   if (!environment.local) {
  //     this.headers = this.headers
  //       .set('X-Firebase-AppCheck', this.authService.appCheckToken!)
  //       .set('Accepts', 'application/json');
  //     console.debug(this.headers);
  //     this.mainPosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/main?local=false`, {
  //         headers: this.headers,
  //         observe: 'response',
  //       })
  //       .pipe(
  //         map((posts) => {
  //           console.debug({ yup: posts.headers.keys() });
  //           return this.nextFn(posts.body!);
  //         }),
  //         catchError(this.handleError),
  //       );

  //     this.puppyPosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/puppy?local=false`, {
  //         headers: this.headers,
  //       })
  //       .pipe(
  //         map((posts) => {
  //           return this.nextFn(posts);
  //         }),
  //         catchError(this.handleError),
  //       );

  //     this.articlePosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/articles?local=false`, {
  //         headers: this.headers,
  //       })
  //       .pipe(
  //         map((posts) => {
  //           return this.nextFn(posts);
  //         }),
  //         catchError(this.handleError),
  //       );

  //     this.applePosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/apple?local=false`, {
  //         headers: this.headers,
  //       })
  //       .pipe(
  //         map((posts) => {
  //           return this.nextFn(posts);
  //         }),
  //         catchError(this.handleError),
  //       );

  //     this.animePosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/anime?local=false`, {
  //         headers: this.headers,
  //       })
  //       .pipe(
  //         map((posts) => {
  //           return this.nextFn(posts);
  //         }),
  //         catchError(this.handleError),
  //       );

  //     this.blockchainPosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/blockchain?local=false`, {
  //         headers: this.headers,
  //       })
  //       .pipe(
  //         map((posts) => {
  //           return this.nextFn(posts);
  //         }),
  //         catchError(this.handleError),
  //       );
  //   } else if (environment.local) {
  //     this.headers = this.headers
  //       .set('X-Firebase-AppCheck', this.authService.appCheckToken!)
  //       .set('Content-Type', 'application/json')
  //       .set('Accept', 'application/json');

  //     this.mainPosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/main`, {
  //         headers: this.headers,
  //         params: { local: true },
  //       })
  //       .pipe(
  //         map((posts) => {
  //           return this.nextFn(posts);
  //         }),
  //         catchError(this.handleError),
  //       );

  //     this.puppyPosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/puppy`, {
  //         headers: this.headers,
  //         params: { local: true },
  //       })
  //       .pipe(
  //         map((posts) => {
  //           return this.nextFn(posts);
  //         }),
  //         catchError(this.handleError),
  //       );
  //     this.articlePosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/articles`, {
  //         headers: this.headers,
  //         params: { local: true },
  //       })
  //       .pipe(
  //         map((posts) => {
  //           return this.nextFn(posts);
  //         }),
  //         catchError(this.handleError),
  //       );
  //     this.applePosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/apple`, {
  //         headers: this.headers,
  //         params: { local: true },
  //       })
  //       .pipe(
  //         map((posts) => {
  //           return this.nextFn(posts);
  //         }),
  //         catchError(this.handleError),
  //       );
  //     this.animePosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/anime`, {
  //         headers: this.headers,
  //         params: { local: true },
  //       })
  //       .pipe(
  //         map((posts) => {
  //           return this.nextFn(posts);
  //         }),
  //         catchError(this.handleError),
  //       );
  //     this.blockchainPosts = this.httpClient
  //       .get<Post[]>(`${this.postUrl}/blockchain`, {
  //         headers: this.headers,
  //         params: { local: true },
  //       })
  //       .pipe(
  //         map((posts) => {
  //           return this.nextFn(posts);
  //         }),
  //         catchError(this.handleError),
  //       );
  //   } else {
  //     this.mainPosts = of(
  //       staticTextPosts.filter(
  //         (post) => post.location.toLowerCase() === 'main',
  //       ),
  //     );
  //     this.puppyPosts = of(
  //       staticTextPosts.filter(
  //         (post) => post.location.toLowerCase() === 'puppy',
  //       ),
  //     );
  //     this.articlePosts = of(
  //       staticTextPosts.filter(
  //         (post) => post.location.toLowerCase() === 'article',
  //       ),
  //     );
  //     this.applePosts = of(
  //       staticTextPosts.filter(
  //         (post) => post.location.toLowerCase() === 'apple',
  //       ),
  //     );
  //     this.animePosts = of(
  //       staticTextPosts.filter(
  //         (post) => post.location.toLowerCase() === 'anime',
  //       ),
  //     );
  //     this.blockchainPosts = of(
  //       staticTextPosts.filter(
  //         (post) => post.location.toLowerCase() === 'blockchain',
  //       ),
  //     );
  //   }
  //   // }
  // }

  async getMainPosts() {
    this.authService.appCheckToken = (
      await this.authService.getAppCheckToken('db:urls')
    )?.token;
    this.headers = new HttpHeaders({
      'X-Firebase-AppCheck': this.authService.appCheckToken!,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    console.debug(this.headers);
    if (!environment.local) {
      // .set('X-Firebase-AppCheck', this.authService.appCheckToken!)
      // .set('Content-Type', 'application/json')
      // .set('Accept', 'application/json');

      return this.httpClient
        .get<Post[]>(`${this.postUrl}/main?local=false`, {
          headers: this.headers,
          observe: 'response',
        })
        .pipe(
          map((posts) => {
            console.debug({ yup: posts.headers.keys() });
            return this.nextFn(posts.body!);
          }),
          catchError(this.handleError),
        );
    } else if (environment.local) {
      // this.headers = new HttpHeaders()
      //   .set('X-Firebase-AppCheck', this.authService.appCheckToken!)
      //   .set('Content-Type', 'application/json')
      //   .set('Accept', 'application/json');

      return this.httpClient
        .get<Post[]>(`${this.postUrl}/main`, {
          headers: this.headers,
          params: { local: true },
        })
        .pipe(
          map((posts) => {
            return this.nextFn(posts);
          }),
          catchError(this.handleError),
        );
    } else {
      return of(
        staticTextPosts.filter(
          (post) => post.location.toLowerCase() === 'main',
        ),
      );
    }
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

  createPost(post: Post) {
    this.headers = this.headers
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.httpClient.post(`${this.postUrl}`, post, {
      headers: this.headers,
      params: { local: true },
    });
  }

  private nextFn(posts: Post[]) {
    return posts.sort((a: Post, b: Post) => {
      const aVal = a.created_at
        ? DateTime.fromISO(a.created_at)
        : a.title.charAt(0);
      const bVal = b.created_at
        ? DateTime.fromISO(b.created_at)
        : b.title.charAt(0);
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });
  }
}
