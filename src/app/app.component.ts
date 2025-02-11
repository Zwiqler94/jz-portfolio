import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { FooterComponent } from './components/footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DatabaseService } from 'src/app/services/database/database.service';
import { AppCheck } from '@angular/fire/app-check';
import { Auth } from '@angular/fire/auth';
import { NavBarComponent } from 'src/app/components/nav-bar/nav-bar.component';

@Component({
  selector: 'jzp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButton,
    MatIcon,
    MatSidenavModule,
    RouterOutlet,
    FooterComponent,
    NavBarComponent,
  ],
})
export class AppComponent implements OnInit {
  private swUpdate = inject(SwUpdate);
  private authService = inject(AuthService);
  private fbAuth = inject(Auth);
  private appCheck = inject(AppCheck);
  private dbService = inject(DatabaseService);
  private snack = inject(MatSnackBar);

  title = 'jlz-portfolio';

  constructor() {
    this.dbService.appCheck = inject(AppCheck);
  }

  async ngOnInit(): Promise<void> {
    // await this.dbService.setDBUrls();

    this.authService.appCheckToken = (
      await this.authService.getAppCheckToken('app:oninit')
    )?.token;

    // (await this.lp.getAPIKey())?.subscribe((apiKey) => (this.lp.apiKey = apiKey.k));

    if (this.swUpdate.isEnabled) {
      console.debug('Service Worker Enabled');

      this.swUpdate.unrecoverable.subscribe((event) => {
        const swUpdateSnack = this.snack.open(
          `An error occurred that we cannot recover from: ${event.reason}. Please reload the page.`,
        );
        swUpdateSnack
          .afterDismissed()
          .subscribe((dismiss: MatSnackBarDismiss) => {
            if (dismiss.dismissedByAction) {
              document.location.reload();
            }
          });
      });

      this.swUpdate.versionUpdates
        .pipe(
          filter(
            (evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY',
          ),
        )
        .subscribe({
          next: (x) => {
            if (x) {
              const swUpdateSnack = this.snack.open(
                'New App Version Detected, Update?',
                'Yup!',
              );
              swUpdateSnack
                .afterDismissed()
                .subscribe((dismiss: MatSnackBarDismiss) => {
                  if (dismiss.dismissedByAction) {
                    document.location.reload();
                  }
                });
            }
          },
          error: (err) => console.error(err),
        });
    }
  }

  logout() {
    this.authService.logout();
  }
}
