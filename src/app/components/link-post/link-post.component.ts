import { Component, Input, OnInit } from '@angular/core';
import { LinkPreview } from 'src/app/components/models/link-post';
import { PostBaseComponent } from 'src/app/components/post-base/post-base.component';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';

@Component({
  selector: 'app-link-post',
  templateUrl: './link-post.component.html',
  styleUrls: ['./link-post.component.scss'],
})
export class LinkPostComponent extends PostBaseComponent implements OnInit {
  linkPreviewData: LinkPreview;

  constructor(private linkPreviewService: LinkPreviewService) {
    super();
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
    const linkArray = this.postContent.match(
      /(http|https):\/\/(www\.)?[a-zA-Z0-9]+\.[a-zA-Z0-9]+[a-zA-Z0-9/\-.,&?=%#();:~]*/
    );
    if (linkArray !== null) {
      try {
        (
          await this.linkPreviewService.getLinkPreview(String(linkArray[0]))
        ).subscribe({
          next: (data: unknown) => {
            {
              this.linkPreviewData = data as LinkPreview;
            }
          },
          error: (err) => { throw new Error(JSON.stringify(err)) },
        });
      } catch (err: any) {
        throw new Error(err);
      }
    }
  }
}
