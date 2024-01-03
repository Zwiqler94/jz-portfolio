import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fbAuth: Auth = inject(Auth);
  private _userToken: string | undefined;
  private _uid: string | undefined;

  constructor(private router: Router) {}

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
    return true
    // if (this.uid) {
    //   return true;
    // } else {
    //   this.router.navigateByUrl('/login');
    //   return false;
    // }
  }

  logout() {
    this.fbAuth.signOut();
    this.uid = undefined;
    this.userToken = undefined;
    this.router.navigateByUrl('/login');
  }
}
