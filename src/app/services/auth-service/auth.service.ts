import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AppCheck, getToken } from '@angular/fire/app-check';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _appCheck: AppCheck = inject(AppCheck);
  private fbAuth: Auth = inject(Auth);
  private _userToken: string | undefined;
  private _uid: string | undefined;
  private _appCheckToken: string | undefined;
  static called = 0;
  private _isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
  ) {
    if (!this.appCheckToken)
      this.getAppCheckToken('auth:constructor')
        .then((val) =>
          val
            ? (this._appCheckToken = val.token)
            : (this._appCheckToken = undefined),
        )
        .finally(() => console.debug('tokened!'));
  }

  public get userToken(): string | undefined {
    return this._userToken;
  }
  public set userToken(value: string | undefined) {
    this._userToken = value;
  }

  public get uid(): string | undefined {
    return this._uid;
  }
  public set uid(value: string | undefined) {
    this._uid = value;
  }

  canActivate() {
    // return true;
    if (this.uid) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  async getAppCheckToken(from: string) {
    console.debug({ cal: AuthService.called++, from });

    if (this.isLoggedIn) {
      if (!environment.local && this.appCheck) {
        return getToken(this.appCheck);
      } else {
        // environment.serviceOptions.ADMIN_USER = await lastValueFrom(this.httpClient.get(`${environment.serviceOptions.secretService}/ADMIN_USER_DEV`)) as string;
        // environment.serviceOptions.ADMIN_PASS = (await lastValueFrom(
        //    this.httpClient.get(
        //      `${environment.serviceOptions.secretService}/ADMIN_PASS_DEV`,
        //    ),
        //  )) as string;

        // const basicAuthBase64 = btoa(
        //   `${environment.serviceOptions.ADMIN_USER}:${environment.serviceOptions.ADMIN_PASS}`,
        // );

        try {
          const bearerToken = await this.fbAuth.currentUser?.getIdToken();

          const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${bearerToken}`,
          );

          const token = await lastValueFrom(
            this.httpClient
              .get<{
                token: string;
              }>(`${environment.serviceOptions.url}/api/v3/auth/token`, {
                headers,
              })
              .pipe(catchError(this.handleError)),
          );

          return token;
        } catch (err) {
          console.error(err);
          return;
        }
      }
    }
    return;
  }

  logout() {
    this.fbAuth.signOut();
    this.uid = undefined;
    this.userToken = undefined;
    this.appCheckToken = undefined;
    this.isLoggedIn = false;
    this.router.navigateByUrl('/login');
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

  public get appCheck(): AppCheck {
    return this._appCheck;
  }
  public set appCheck(value: AppCheck) {
    this._appCheck = value;
  }

  public get appCheckToken(): string | undefined {
    return this._appCheckToken;
  }
  public set appCheckToken(value: string | undefined) {
    this._appCheckToken = value;
  }

  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  public set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }
}
