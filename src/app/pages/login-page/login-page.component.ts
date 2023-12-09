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

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  private fbAuth: Auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider().addScope('profile');

  constructor(private router: Router, private auth: AuthService) {
    this.fbAuth.setPersistence(browserSessionPersistence);
  }

  ngOnInit(): void {
    onAuthStateChanged(this.fbAuth, (user) => {
      if (user) {
        this.auth.uid = user.uid;
        this.router.navigateByUrl('/home');
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  signIn() {
    signInWithPopup(this.fbAuth, this.googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        this.auth.userToken = credential?.accessToken;
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
