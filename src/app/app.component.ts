import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarDismiss,
} from '@angular/material/snack-bar';
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
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      console.log('Service Worker Enabled')
      this.swUpdate.versionUpdates
        .pipe(
          filter(
            (evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'
          )
        )
        .subscribe((x) => {
          if (x) {
            const d = this.snack.open(
              'New App Version Detected, Update?',
              'Yup!'
            );
            d.afterDismissed().subscribe((f: MatSnackBarDismiss) => {
              console.log(f.dismissedByAction);
              while (!f.dismissedByAction) {
                this.snack.open('Hurry up and update!', 'UPDATE!');
              }
              document.location.reload();
            });
          }
        });
    }
  }

  logout() {
    this.auth.logout();
  }
}
