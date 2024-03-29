import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { ServiceWorkerService } from 'src/app/services/service-worker/service-worker.service';
import { MatDialog } from '@angular/material/dialog';
import { NewPostDialogComponent } from 'src/app/components/new-post-dialog/new-post-dialog.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-feed-page',
  templateUrl: './main-feed-page.component.html',
  styleUrls: ['./main-feed-page.component.scss'],
})
export class MainFeedPageComponent implements OnInit {
  constructor(
    private snack: MatSnackBar,
    private sw: ServiceWorkerService,
    private dialog: MatDialog,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.sw.swUpdates.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      )
      .subscribe((x) => {
        if (x) {
          const d = this.snack.open(
            'New App Version Detected, Update?',
            'Yup!',
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

  openNewPostDialog() {
    this.dialog.open(NewPostDialogComponent);
  }

  isUserAdmin() {
    return (
      this.auth.uid === 'vsKhoiQqEzOQjk699NnCDtdu30Z2' || environment.local
    );
  }
}
