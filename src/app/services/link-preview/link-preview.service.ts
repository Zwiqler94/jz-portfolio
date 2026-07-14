import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import {
  catchError,
  delay,
  from,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { LinkPreview } from 'src/app/components/models/post.model';
import { AuthService } from 'src/app/services/auth-service/auth.service';

interface SecretResponse {
  k: string;
}

@Injectable({
  providedIn: 'root',
})
export class LinkPreviewService {
  private authService = inject(AuthService);

  private httpClient = inject(HttpClient);

  // private _appCheck: AppCheck;
  private baseUrl = 'https://api.linkpreview.net/';
  private _apiKey!: string;
  private apiKeyRequest?: Observable<string>;
  public get apiKey(): string {
    return this._apiKey;
  }
  public set apiKey(value: string) {
    this._apiKey = value;
  }

  getAPIKey(): Observable<SecretResponse> {
    const params = new HttpParams().append(
      'prod',
      String(environment.production),
    );
    let secretsUrl = environment.serviceOptions.secretService;
    secretsUrl += '/link-previews';
    return this.getAppCheckHeaders('link-preview:key').pipe(
      switchMap((headers) =>
        this.httpClient.get<SecretResponse>(secretsUrl, {
          params,
          headers,
        }),
      ),
      delay(2500),
      catchError(this.handleError),
    );
  }

  getLinkPreview(url: string): Observable<LinkPreview> {
    return this.getAPIKeyValue().pipe(
      switchMap((apiKey) =>
        this.getAppCheckHeaders('link-preview:preview').pipe(
          switchMap((headers) => {
            const params = new HttpParams()
              .append('key', apiKey)
              .append('q', url);
            return this.httpClient.get<LinkPreview>(this.baseUrl, {
              params,
              headers,
            });
          }),
        ),
      ),
      delay(15000),
      catchError(this.handleError),
    );
  }

  private getAPIKeyValue(): Observable<string> {
    if (this._apiKey) {
      return of(this._apiKey);
    }

    this.apiKeyRequest ??= this.getAPIKey().pipe(
      map((response) => response.k),
      tap((apiKey) => (this._apiKey = apiKey)),
      catchError((error) => {
        this.apiKeyRequest = undefined;
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.apiKeyRequest;
  }

  private getAppCheckHeaders(source: string): Observable<HttpHeaders> {
    return this.getAppCheckToken(source).pipe(
      map(
        (appCheckToken) =>
          new HttpHeaders({
            'X-Firebase-AppCheck': appCheckToken,
          }),
      ),
    );
  }

  private getAppCheckToken(source: string): Observable<string> {
    if (this.authService.appCheckToken) {
      return of(this.authService.appCheckToken);
    }

    return from(this.authService.getAppCheckToken(source)).pipe(
      map((response) => {
        const appCheckToken = response?.token;
        if (!appCheckToken) {
          throw new Error('AppCheck token is missing.');
        }
        this.authService.appCheckToken = appCheckToken;
        return appCheckToken;
      }),
    );
  }

  handleError = (error: unknown) => {
    if (error instanceof HttpErrorResponse && error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.message, error.error);
    } else if (error instanceof HttpErrorResponse) {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () =>
        new Error(
          `Something bad happened; please try again later. Error Message: ${
            error instanceof Error ? error.message : String(error)
          } `,
        ),
    );
  };
}
