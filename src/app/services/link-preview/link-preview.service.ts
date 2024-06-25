/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, lastValueFrom, throwError } from 'rxjs';
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
  // private _appCheck: AppCheck;
  private baseUrl = 'https://api.linkpreview.net/';
  private _apiKey!: string;
  private params: HttpParams = new HttpParams().set('key', this.apiKey);
  headers: HttpHeaders = new HttpHeaders();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
    // this.appCheck = appCheck;
    if (environment.local && typeof environment.appCheckDebug === 'string') {
      console.debug('In DEBUG MODE');
    }
  }

  // ‰

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get apiKey() {
    return this._apiKey;
  }

  set apiKey(value) {
    this._apiKey = value;
  }

  async getAppCheckToken() {
    if (!this.authService.appCheckToken)
      this.authService.appCheckToken = (
        await this.authService.getAppCheckToken('linkprev:getTok')
      ).token;
    else throw new Error('no token!');
    // let token = '';
    // try {
    //   if (!environment.local && this.appCheck) {
    //     token = (await getToken(this.appCheck)).token;
    //   } else {
    //     if (!this.authService.appCheckToken) {
    //       this.authService.getAppCheckToken().subscribe((authToken) => {
    //         this.authService.appCheckToken = authToken.token;
    //       });
    //     }
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
    // return token;
  }

  async getAPIKey() {
    try {
      await this.getAppCheckToken();
      this.params = new HttpParams();
      this.headers = this.headers.set(
        'X-Firebase-AppCheck',
        this.authService.appCheckToken!,
      );
    } catch (err) {
      console.log(err);
    }

    this.params = this.params.set('prod', environment.production);
    let secretsUrl = environment.serviceOptions.secretService;
    secretsUrl += '/link-previews';

    return this.httpClient.get<SecretResponse>(secretsUrl, {
      params: this.params,
      headers: this.headers,
    });
  }

  async getLinkPreview(url: string) {
    try {
      await this.getAppCheckToken();
      this.params = new HttpParams();

      this.headers = this.headers.set(
        'X-Firebase-AppCheck',
        this.authService.appCheckToken!,
      );
      const apiKey: SecretResponse = await lastValueFrom(
        await this.getAPIKey(),
      );
      this.params = this.params.set('key', apiKey.k).set('q', url);
      return this.httpClient
        .get<LinkPreview>(this.baseUrl, {
          params: this.params,
          headers: this.headers,
        })
        .pipe(catchError(this.handleError));
    } catch (err) {
      console.error(err);
      throw Error(JSON.stringify(err));
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
}
