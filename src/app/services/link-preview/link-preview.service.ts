import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, delay, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LinkPreview } from 'src/app/components/models/post.model';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { AppCheck } from '@angular/fire/app-check';

interface SecretResponse {
  k: string;
}

@Injectable({
  providedIn: 'root',
})
export class LinkPreviewService {
  private appCheck = inject(AppCheck);
  private authService = inject(AuthService);

  private httpClient = inject(HttpClient);

  // private _appCheck: AppCheck;
  private baseUrl = 'https://api.linkpreview.net/';
  private _apiKey!: string;
  public get apiKey(): string {
    return this._apiKey;
  }
  public set apiKey(value: string) {
    this._apiKey = value;
  }

  /** Inserted by Angular inject() migration for backwards compatibility */
  // constructor(...args: unknown[]){}
  // private params: HttpParams = new HttpParams().set('key', this.apiKey);
  // headers: HttpHeaders = new HttpHeaders();

  // constructor() {
  //   this.getAPIKey().then(ob=>ob?.subscribe(key=>this._apiKey = key.k))
  // }

  // ‰

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

  // async hasAppCheckToken() {
  //   if (this.authService.appCheckToken) return true;
  //   else if (!this.authService.appCheckToken) {
  //     try {
  //       this.authService.appCheckToken = (
  //         await this.authService.getAppCheckToken('linkprev:getTok')
  //       )?.token;
  //       return true;
  //     } catch (err) {
  //       console.error(err);
  //       throw new Error(JSON.stringify(err));
  //     }
  //   } else return false;
  // }

  async getAPIKey() {
    try {
      if (this.authService.appCheckToken) {
        const headers = new HttpHeaders().append(
          'X-Firebase-AppCheck',
          this.authService.appCheckToken,
        );
        const params = new HttpParams().append(
          'prod',
          String(environment.production),
        );
        let secretsUrl = environment.serviceOptions.secretService;
        secretsUrl += '/link-previews';
        return this.httpClient
          .get<SecretResponse>(secretsUrl, {
            params,
            headers,
          })
          .pipe(delay(2500), catchError(this.handleError));
      }
      console.error('meep');
      throw Error('meep');
    } catch (err) {
      console.debug(err);
      return;
    }
  }

  getLinkPreview(url: string) {
    try {
      if (this.authService.appCheckToken) {
        const headers = new HttpHeaders().append(
          'X-Firebase-AppCheck',
          this.authService.appCheckToken,
        );

        if (this._apiKey) {
          const params = new HttpParams()
            .append('key', this._apiKey)
            .append('q', url);
          return this.httpClient
            .get<LinkPreview>(this.baseUrl, {
              params,
              headers,
            })
            .pipe(delay(15000), catchError(this.handleError));
        } else {
          console.debug('API Key Error');
          throw new Error('API Key Error');
        }
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
