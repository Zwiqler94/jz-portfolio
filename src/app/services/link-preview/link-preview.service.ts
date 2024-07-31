/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, delay, lastValueFrom, throwError } from 'rxjs';
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
  // private params: HttpParams = new HttpParams().set('key', this.apiKey);
  // headers: HttpHeaders = new HttpHeaders();

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
  // get apiKey() {
  //   if (!this._apiKey) {
  //     this.getAPIKey()
  //       .then(async (res) => {
  //         try {
  //           if (res) this._apiKey = (await lastValueFrom(res)).k;
  //         } catch (err) {
  //           console.error(err);
  //         }
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  //   return this._apiKey;
  // }

  // set apiKey(value) {
  //   this._apiKey = value;
  // }

  async hasAppCheckToken() {
    if (this.authService.appCheckToken) return true;
    else if (!this.authService.appCheckToken) {
      try {
        this.authService.appCheckToken = (
          await this.authService.getAppCheckToken('linkprev:getTok')
        )?.token;
        return true;
      } catch (err) {
        console.error(err);
        throw new Error(JSON.stringify(err));
      }
    } else return false;
  }

  getAPIKey() {
    const params = new HttpParams();
    const headers = new HttpHeaders();
    try {
      headers.set('X-Firebase-AppCheck', this.authService.appCheckToken!);
      params.set('prod', environment.production);
      let secretsUrl = environment.serviceOptions.secretService;
      secretsUrl += '/link-previews';
      console.debug(headers.get('X-Firebase-AppCheck'));
      return this.httpClient
        .get<SecretResponse>(secretsUrl, {
          params,
          headers,
        })
        .pipe(delay(50000), catchError(this.handleError));
    } catch (err) {
      console.debug(err);
      return;
    }
  }

  async getLinkPreview(url: string) {
    try {
      const hasAppCheckToken = await this.hasAppCheckToken();
      let params = new HttpParams();
      let headers = new HttpHeaders();
      if (hasAppCheckToken) {
        headers = headers.set(
          'X-Firebase-AppCheck',
          this.authService.appCheckToken!,
        );
        const apiKey = (await lastValueFrom(this.getAPIKey()!)).k;

        params = params.set('key', apiKey).set('q', url);
        return this.httpClient
          .get<LinkPreview>(this.baseUrl, {
            params,
            headers,
          })
          .pipe(delay(30000), catchError(this.handleError));
      } else {
        console.debug('Token Error');
        throw new Error('Token Error');
      }
    } catch (err) {
      console.error(err);
      throw new Error(JSON.stringify(err));
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
