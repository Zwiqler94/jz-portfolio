import { Component, OnInit } from '@angular/core';
import {
  LinkPreview,
  MissingLinkPreviewData,
} from 'src/app/components/models/post.model';
import { LinkPost } from 'src/app/components/models/post.model';
import { PostBaseComponent } from 'src/app/components/post-base/post-base.component';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';

@Component({
  selector: 'app-link-post',
  templateUrl: './link-post.component.html',
  styleUrls: ['./link-post.component.scss'],
})
export class LinkPostComponent
  extends PostBaseComponent
  implements OnInit, LinkPost
{
  linkPreviewData: LinkPreview;
  uri: string;
  image?: string | undefined;

  constructor(private linkPreviewService: LinkPreviewService) {
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
    const linkArray = this.content.match(
      /(http|https):\/\/(www\.)?[a-zA-Z0-9]+\.[a-zA-Z0-9]+[a-zA-Z0-9/\-.,&?=%#();:~]*/,
    );
    if (linkArray !== null) {
      this.uri = linkArray[0];
      try {
        (
          await this.linkPreviewService.getLinkPreview(String(this.uri))
        ).subscribe({
          next: (data: unknown) => {
            {
              this.linkPreviewData = data as LinkPreview;
              this.title = this.linkPreviewData.title;
              this.content = this.linkPreviewData.description;
              this.image = this.linkPreviewData.image;
            }
          },
          error: (err) => {
            this.title = MissingLinkPreviewData.title;
            this.content = MissingLinkPreviewData.description;
            throw new Error(JSON.stringify(err));
          },
        });
      } catch (err: any) {
        throw new Error(err);
      }
    }
  }
}
