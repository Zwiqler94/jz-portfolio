import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
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
    if (this.userToken) {
      return true;
    } else {
      this.router.navigateByUrl('');
      return false;
    }
  }

  logout() {
    this.fbAuth.signOut();
    this.userToken = undefined;
    this.router.navigateByUrl('');
  }
}
