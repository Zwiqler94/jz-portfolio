import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewPostDialogComponent } from 'src/app/components/new-post-dialog/new-post-dialog.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { environment } from 'src/environments/environment';
import { FeedComponent } from '../../components/feed/feed.component';
import { MatButton } from '@angular/material/button';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';

@Component({
  selector: 'jzp-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss'],
  imports: [MatButton, FeedComponent],
})
export class HomePageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private auth = inject(AuthService);
  private cd = inject(ChangeDetectorRef);
  private lp = inject(LinkPreviewService);
  triggerFetch: boolean;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}

  async ngOnInit(): Promise<void> {
    this.auth.appCheckToken = (
      await this.auth.getAppCheckToken('app:oninit')
    )?.token;

    if (this.auth.appCheckToken) {
      this.lp
        .getAPIKey()
        .then((ob) => ob?.subscribe((key) => (this.lp.apiKey = key.k)));
    }
  }

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
