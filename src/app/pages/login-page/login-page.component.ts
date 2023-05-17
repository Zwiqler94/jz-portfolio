import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  private fbAuth: Auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider();

  constructor(private router: Router, private auth: AuthService){}

  signIn() {
    signInWithPopup(this.fbAuth, this.googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        this.auth.userToken = credential?.accessToken;
        const user = result.user;
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
