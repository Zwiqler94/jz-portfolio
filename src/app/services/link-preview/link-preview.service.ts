/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { AppCheck, getToken } from '@angular/fire/app-check';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, lastValueFrom, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppCheckTokenResult } from 'firebase/app-check';
import { LinkPreview } from 'src/app/components/models/post.model';

interface SecretResponse {
  k: string;
}

@Injectable({
  providedIn: 'root',
})
export class LinkPreviewService {
  private _appCheck: AppCheck;
  private baseUrl = 'https://api.linkpreview.net/';
  private _apiKey!: string;
  private params: HttpParams = new HttpParams().set('key', this.apiKey);
  private tokenResult: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(
    private httpClient: HttpClient,
    appCheck: AppCheck,
  ) {
    try {
      this.appCheck = appCheck;
      if (environment.local && typeof environment.appCheckDebug === 'string') {
        this.headers = new HttpHeaders().set(
          'X-Firebase-AppCheck-Debug',
          environment.appCheckDebug,
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  get appCheck() {
    return this._appCheck;
  }

  set appCheck(x) {
    this._appCheck = x;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get apiKey() {
    return this._apiKey;
  }

  set apiKey(value) {
    this._apiKey = value;
  }

  async getAppCheckToken(): Promise<string | AppCheckTokenResult | undefined> {
    try {
      if (!environment.local && this.appCheck) {
        this.tokenResult = (await getToken(this.appCheck)).token;
      } else {
        this.tokenResult = '';
      }
    } catch (err) {
      console.error(err);
    }
    return this.tokenResult;
  }

  getAPIKey() {
    this.params = new HttpParams();
    if (!environment.local)
      this.headers = this.headers.set('X-Firebase-AppCheck', this.tokenResult);
    this.params = this.params.set('prod', environment.production);
    let secretsUrl = environment.serviceOptions.secretService;
    secretsUrl += '/link-previews';
    return this.httpClient.get<SecretResponse>(secretsUrl, {
      params: this.params,
      headers: this.headers,
    });
  }

  async getLinkPreview(url: string) {
    await this.getAppCheckToken();
    this.params = new HttpParams();
    if (!environment.local)
      this.headers = this.headers.set('X-Firebase-AppCheck', this.tokenResult);

    try {
      const apiKey: SecretResponse = await lastValueFrom(this.getAPIKey());
      this.params = this.params.set('key', apiKey.k).set('q', url);
      return this.httpClient
        .get<LinkPreview>(this.baseUrl, {
          params: this.params,
          headers: this.headers,
        })
        .pipe(retry({ count: 3, delay: 30000 }), catchError(this.handleError));
    } catch (err) {
      console.error(err);
      throw Error(JSON.stringify(err));
    }
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
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
      () => new Error('Something bad happened; please try again later.'),
    );
  }
}
