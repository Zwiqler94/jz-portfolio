import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { ServiceWorkerService } from 'src/app/services/service-worker/service-worker.service';
import { MatDialog } from '@angular/material/dialog';
import { NewPostDialogComponent } from 'src/app/components/new-post-dialog/new-post-dialog.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { environment } from 'src/environments/environment';
import { FeedComponent } from '../../components/feed/feed.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: true,
  imports: [MatButton, FeedComponent],
})
export class HomePageComponent implements OnInit {
  private snack = inject(MatSnackBar);
  private sw = inject(ServiceWorkerService);
  private dialog = inject(MatDialog);
  private auth = inject(AuthService);
  private cd = inject(ChangeDetectorRef);

  shouldFetchPosts = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

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
            console.debug(f.dismissedByAction);
            while (!f.dismissedByAction) {
              this.snack.open('Hurry up and update!', 'UPDATE!');
            }
            document.location.reload();
          });
        }
      });
    // this.shouldFetchPosts = !this.shouldFetchPosts;
  }

  openNewPostDialog() {
    const dialogRef = this.dialog.open(NewPostDialogComponent);
    dialogRef.afterClosed().subscribe((res) => {
      this.shouldFetchPosts = true;
    });
    this.cd.detectChanges();
  }

  isUserAdmin() {
    return (
      this.auth.uid === 'vsKhoiQqEzOQjk699NnCDtdu30Z2' || environment.local
    );
  }

  isLoggedIn() {
    return this.auth.isLoggedIn;
  }
}
