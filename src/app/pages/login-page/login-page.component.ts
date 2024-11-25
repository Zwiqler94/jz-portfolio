import { Component, OnInit, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  browserLocalPersistence,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [MatCard, MatCardContent, MatButton],
})
export class LoginPageComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);

  private fbAuth: Auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider().addScope('profile');
  userName: string | null;
  private _isLoggedIn: boolean;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.fbAuth
      .setPersistence(browserLocalPersistence)
      .catch((err) => console.error(err));
  }

  ngOnInit(): void {
    onAuthStateChanged(this.fbAuth, async (user) => {
      if (user) {
        this.auth.uid = user.uid;
        this.auth.isLoggedIn = true;
        this.router.navigateByUrl('/home');
      } else {
        this.auth.isLoggedIn = false;
        this.auth.uid = undefined;
        this.auth.userToken = undefined;
        this.auth.appCheckToken = undefined;
        this.router.navigateByUrl('/login');
      }
    });
  }

  signIn() {
    signInWithPopup(this.fbAuth, this.googleProvider)
      .then(async (result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // this.auth.userToken = credential?.accessToken;
        // if (!this.auth.appCheckToken)
        this.auth.uid = result.user.uid;
        this.auth.appCheckToken = (
          await this.auth.getAppCheckToken('login:signin')
        )?.token;

        // console.debug(this.auth.appCheckToken);
        this.userName = result.user.displayName;

        console.debug(`${this.userName} is logged in`);
        this.router.navigateByUrl('/home');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMsg = error.message;
        const user = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error({ errorCode, errorMsg, user, credential });
      });
  }
}
