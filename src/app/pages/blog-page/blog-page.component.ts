import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewPostDialogComponent } from 'src/app/components/new-post-dialog/new-post-dialog.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { environment } from 'src/environments/environment';
import { FeedComponent } from '../../components/feed/feed.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'jzp-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss'],
  imports: [MatButton, FeedComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private dialog = inject(MatDialog);
  private auth = inject(AuthService);
  private cd = inject(ChangeDetectorRef);
  triggerFetch: boolean;

  openNewPostDialog() {
    const dialogRef = this.dialog.open(NewPostDialogComponent);
    dialogRef.afterClosed().subscribe((res) => {
      this.triggerFetch = true;
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
