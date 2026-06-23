import {
  Component,
  EnvironmentInjector,
  OnDestroy,
  OnInit,
  inject,
  runInInjectionContext,
} from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  browserLocalPersistence,
  Unsubscribe,
  NextOrObserver,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'jzp-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [MatCardModule, MatButtonModule],
})
export class LoginPageComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  private fbAuth: Auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider().addScope('profile');
  private userName: string | null;
  private environmentInjector = inject(EnvironmentInjector);

  constructor() {
    this.fbAuth
      .setPersistence(browserLocalPersistence)
      .catch((err) => console.error(err));
  }

  ngOnInit(): void {
    const unsubscription = this.fbAuth.onAuthStateChanged({
      next: (user) => {
        if (user) {
          this.auth.uid = user.uid;
          this.auth.isLoggedIn = true;
          this.router.navigateByUrl('/home');
        } else {
          this.auth.isLoggedIn = false;
          this.auth.uid = undefined;
          this.auth.userToken = undefined;
          this.auth.appCheckToken = '';
          this.router.navigateByUrl('/login');
        }
      },
      error: (err) => {
        console.error('Auth state change error:', err);
        unsubscription();
      },
      complete: () => {
        console.debug('Auth state change completed');
        unsubscription();
      },
    });
  }

  async signIn() {
    runInInjectionContext(this.environmentInjector, () => {
      signInWithPopup(this.fbAuth, this.googleProvider)
        .then(async (result) => {
          this.auth.uid = result.user.uid;
          this.auth.appCheckToken = (
            await this.auth.getAppCheckToken('login:signin')
          )?.token;

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
    });
  }
}
