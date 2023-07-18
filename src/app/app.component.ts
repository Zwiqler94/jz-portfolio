import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'jlz-portfolio';

  constructor(
    private auth: AuthService,
  ) {}

  logout() {
    this.auth.logout();
  }
}
