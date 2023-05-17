import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ServiceWorkerService } from 'src/app/services/service-worker/service-worker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'jlz-portfolio';

  constructor(
    private serviceWorker: ServiceWorkerService,
    private auth: AuthService
  ) {}

  logout() {
    this.auth.logout();
  }
}
