import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import {
  LinkPreview,
  MissingLinkPreviewData,
  PostType,
} from 'src/app/components/models/post.model';
import { PostBaseComponent } from 'src/app/components/post-base/post-base.component';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatabaseService } from 'src/app/services/database/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jzp-link-post',
  templateUrl: './link-post.component.html',
  styleUrls: ['./link-post.component.scss'],
  imports: [PostBaseComponent],
})
export class LinkPostComponent implements OnInit, OnChanges, OnDestroy {
  private sanitizer = inject(DomSanitizer);
  // Inputs for LinkPost
  readonly id = input<number>();
  readonly title_or_uri = input<string>();
  readonly image_uri = input<string>();
  readonly content = input.required<string>();
  readonly type = input<PostType | undefined>(); // Constrain type to PostType or undefined

  // Link preview metadata
  previewData: LinkPreview = MissingLinkPreviewData;
  private lastPreviewKey: string | undefined;

  private linkPreviewService = inject(LinkPreviewService);
  private databaseService = inject(DatabaseService);

  sanitizedBackupContent: SafeHtml;
  private previewSubscription: Subscription;
  private previewDataSubscription: Subscription;

  ngOnInit() {
    this.getPreview();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title_or_uri']) {
      this.getPreview();
    }
  }

  ngOnDestroy() {
    if (this.previewSubscription) {
      this.previewSubscription.unsubscribe();
    }
    if (this.previewDataSubscription) {
      this.previewDataSubscription.unsubscribe();
    }
  }

  getPreview() {
    const id = this.id();
    this.sanitizedBackupContent = this.sanitizer.bypassSecurityTrustHtml(
      this.content(),
    );
    const linkUri = this.title_or_uri();
    const imageUri = this.image_uri();

    if (!linkUri) {
      this.previewData = MissingLinkPreviewData;
      this.lastPreviewKey = undefined;
      return;
    }

    const previewKey = `${linkUri}|${imageUri ?? ''}`;
    if (this.lastPreviewKey === previewKey) {
      return;
    }
    this.lastPreviewKey = previewKey;

    if (!imageUri) {
      this.previewSubscription = this.linkPreviewService
        .getLinkPreview(linkUri)
        .subscribe({
          next: (data) => {
            this.previewData = data;
            if (id) {
              const subscription2 = this.databaseService
                .savePreviewData(id, data)
                .subscribe({
                  next: (res) => console.log('stored lp', res),
                  error: (err) => {
                    console.error('Failed to store link preview:', err);
                    subscription2.unsubscribe();
                  },
                  complete: () => subscription2.unsubscribe(),
                });
            }
          },
          error: (err) => {
            console.error('Failed to fetch link preview:', err);
            this.previewData = MissingLinkPreviewData;
            this.previewSubscription.unsubscribe();
          },
          complete: () => this.previewSubscription.unsubscribe(),
        });
      return;
    }

    if (!id) {
      return;
    }

    this.previewDataSubscription = this.databaseService
      .getPreviewData(id)
      .subscribe({
        next: (res) => {
          this.previewData = {
            title: res.title,
            image: imageUri,
            description: '',
            url: res.uri,
          };
        },
        error: (err) => {
          console.error('Failed to fetch stored link preview:', err);

          this.previewDataSubscription.unsubscribe();
        },
        complete: () => this.previewDataSubscription.unsubscribe(),
      });
  }
}
