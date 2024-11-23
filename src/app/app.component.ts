import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import {
  ServiceWorkerModule,
  SwUpdate,
  VersionReadyEvent,
} from '@angular/service-worker';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { FooterComponent } from './components/footer/footer.component';
import {
  MatSidenavContainer,
  MatSidenav,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { DatabaseService } from 'src/app/services/database/database.service';
import { AppCheck } from '@angular/fire/app-check';
import { NgOptimizedImage } from '@angular/common';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatToolbar,
    RouterLink,
    RouterLinkActive,
    MatButton,
    MatMiniFabButton,
    MatIcon,
    MatDivider,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    RouterOutlet,
    FooterComponent,
    NgOptimizedImage,
  ],
})
export class AppComponent implements OnInit {
  private lp = inject(LinkPreviewService);

  private swUpdate = inject(SwUpdate);
  private auth = inject(AuthService);
  private appCheck = inject(AppCheck);
  private dbService = inject(DatabaseService);
  private snack = inject(MatSnackBar);

  title = 'jlz-portfolio';

  constructor() {
    this.dbService.appCheck = inject(AppCheck);
  }

  async ngOnInit(): Promise<void> {
    // await this.dbService.setDBUrls();

    this.auth.appCheckToken = (
      await this.auth.getAppCheckToken('app:oninit')
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
    this.auth.logout();
  }
}
