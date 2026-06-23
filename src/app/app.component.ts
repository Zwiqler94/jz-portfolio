import { Component, InjectionToken, OnInit, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { FooterComponent } from './components/footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DatabaseService } from 'src/app/services/database/database.service';
import { AppCheck } from '@angular/fire/app-check';
import { Auth } from '@angular/fire/auth';
import { NavBarComponent } from 'src/app/components/nav-bar/nav-bar.component';

export const RELOAD_DOCUMENT = new InjectionToken<() => void>(
  'RELOAD_DOCUMENT',
  {
    providedIn: 'root',
    factory: () => () => document.location.reload(),
  },
);

@Component({
  selector: 'jzp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIcon,
    MatSidenavModule,
    RouterOutlet,
    // FooterComponent,
    NavBarComponent,
    FooterComponent,
  ],
})
export class AppComponent implements OnInit {
  private swUpdate = inject(SwUpdate);
  private authService = inject(AuthService);
  private fbAuth = inject(Auth);
  private appCheck = inject(AppCheck);
  private dbService = inject(DatabaseService);
  private snack = inject(MatSnackBar);
  private reloadDocument = inject(RELOAD_DOCUMENT);

  title = 'jlz-portfolio';

  constructor() {
    this.dbService.appCheck = inject(AppCheck);
  }

  async ngOnInit(): Promise<void> {
    // await this.dbService.setDBUrls();

    this.authService.appCheckToken = (
      await this.authService.getAppCheckToken('app:oninit')
    )?.token;

    if (this.swUpdate.isEnabled) {
      console.debug('Service Worker Enabled');

      const subscription = this.swUpdate.unrecoverable.subscribe({
        next: (event) => {
          const swUpdateSnack = this.snack.open(
            `An error occurred that we cannot recover from: ${event.reason}. Please reload the page.`,
          );
          swUpdateSnack
            .afterDismissed()
            .subscribe((dismiss: MatSnackBarDismiss) => {
              if (dismiss.dismissedByAction) {
                this.reloadDocument();
              }
            });
        },
        error: (err) => {
          console.error('Unrecoverable error in Service Worker:', err);
          subscription.unsubscribe();
        },
        complete: () => {
          console.debug('Unrecoverable error subscription completed');
          subscription.unsubscribe();
        },
      });

      const versionSubscription = this.swUpdate.versionUpdates
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
              const snackBarSubscription = swUpdateSnack
                .afterDismissed()
                .subscribe({
                  next: (dismiss: MatSnackBarDismiss) => {
                    if (dismiss.dismissedByAction) {
                      this.reloadDocument();
                    }
                  },
                  error: (err) => {
                    console.error('Error handling version update:', err);
                    snackBarSubscription.unsubscribe();
                  },
                  complete: () => {
                    console.debug(
                      'Version update snack bar subscription completed',
                    );
                    snackBarSubscription.unsubscribe();
                  },
                });
            }
          },
          error: (err) => {
            console.error(err);
            versionSubscription.unsubscribe();
          },
          complete: () => {
            console.debug('Version update subscription completed');
            versionSubscription.unsubscribe();
          },
        });
    }
  }

  logout() {
    this.authService.logout();
  }
}
