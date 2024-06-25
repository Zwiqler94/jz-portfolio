import { Component, OnInit, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  browserSessionPersistence,
  onAuthStateChanged,
  signInWithPopup,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AppCheck } from '@angular/fire/app-check';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  standalone: true,
  imports: [MatCard, MatCardContent, MatButton],
})
export class LoginPageComponent implements OnInit {
  private fbAuth: Auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider().addScope('profile');

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
    this.fbAuth.setPersistence(browserSessionPersistence);
  }

  ngOnInit(): void {
    onAuthStateChanged(this.fbAuth, async (user) => {
      if (user) {
        this.auth.uid = user.uid;
        if (!this.auth.appCheckToken)
          this.auth.appCheckToken = (
            await this.auth.getAppCheckToken('')
          ).token;
        this.router.navigateByUrl('/home');
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  signIn() {
    signInWithPopup(this.fbAuth, this.googleProvider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        this.auth.userToken = credential?.accessToken;
        if (!this.auth.appCheckToken)
          this.auth.appCheckToken = (
            await this.auth.getAppCheckToken('')
          ).token;

        console.debug(this.auth.appCheckToken);
        const user = result.user;
        console.debug(user);
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
