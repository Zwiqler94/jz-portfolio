import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'jlz-portfolio';

  constructor(
    private swUpdate: SwUpdate,
    private auth: AuthService,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // this.dbService.appCheck = inject(AppCheck);

    if (this.swUpdate.isEnabled) {
      console.log('Service Worker Enabled');
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
