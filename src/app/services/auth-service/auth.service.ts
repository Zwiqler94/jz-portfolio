import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fbAuth: Auth = inject(Auth);
  private _userToken: string | undefined;

  constructor(private router: Router) {}

  public get userToken(): string | undefined {
    return this._userToken;
  }
  public set userToken(value: string | undefined) {
    this._userToken = value;
  }

  canActivate() {
    return this.userToken ? true : false;
  }

  logout() {
    this.fbAuth.signOut();
    this.userToken = undefined;
    this.router.navigateByUrl('');
  }
}
