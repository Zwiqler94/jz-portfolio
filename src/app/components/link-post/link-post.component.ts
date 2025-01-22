import { Component, OnInit, inject } from '@angular/core';
import {
  LinkPost,
  LinkPreview,
  MissingLinkPreviewData,
} from 'src/app/components/models/post.model';
import { PostBaseComponent } from 'src/app/components/post-base/post-base.component';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';

import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
  MatCardImage,
  MatCardModule,
} from '@angular/material/card';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { delay } from 'rxjs';

@Component({
    selector: 'app-link-post',
    templateUrl: './link-post.component.html',
    styleUrls: ['./link-post.component.scss'],
    imports: [MatCardModule]
})
export class LinkPostComponent
  extends PostBaseComponent
  implements OnInit, LinkPost
{
  private linkPreviewService = inject(LinkPreviewService);
  private authService = inject(AuthService);

  linkPreviewData: LinkPreview;
  uri: string;
  image?: string;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
    this.type = 'LinkPost';
  }

  get getLinkPreviewData() {
    return this.linkPreviewData;
  }

  get hasLinkPreviewData() {
    return this.getLinkPreviewData !== undefined;
  }

  async ngOnInit() {
    try {
      await this.getLinkPreview();
    } catch (err) {
      console.error(err);
    }
  }

  async getLinkPreview() {
    const headers = new HttpHeaders({
      'X-Firebase-AppCheck': this.authService.appCheckToken!,
    });

    const linkArray = this.content.match(
      /(http|https):\/\/(www\.)?[a-zA-Z0-9]+\.[a-zA-Z0-9]+[a-zA-Z0-9+/\-.,&?=%#(_);:~]*/,
    );
    if (linkArray !== null) {
      this.uri = linkArray[0];
      try {
        (await this.linkPreviewService.getLinkPreview(String(this.uri)))
          .pipe(delay(15000))
          .subscribe({
            next: (data: unknown) => {
              {
                this.linkPreviewData = data as LinkPreview;
                this.title = this.linkPreviewData.title
                  ? this.linkPreviewData.title
                  : this.title;
                this.content = this.linkPreviewData.description;
                this.image = this.linkPreviewData.image;
              }
            },
            error: (err) => {
              this.title = MissingLinkPreviewData.title;
              this.content = MissingLinkPreviewData.description;
              console.error(err);
            },
          });
      } catch (err: any) {
        throw new Error(err);
      }
    }
  }
}
