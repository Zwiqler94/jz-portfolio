import { Component, Input, OnInit } from '@angular/core';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';

@Component({
  selector: 'app-link-post',
  templateUrl: './link-post.component.html',
  styleUrls: ['./link-post.component.scss'],
})
export class LinkPostComponent implements OnInit {
  @Input() postTitle: string;
  @Input() postContent: string;
  linkPreviewData: any;

  constructor(private linkPreviewService: LinkPreviewService) {}

  get getLinkPreviewData() {
    return this.linkPreviewData;
  }

  get hasLinkPreviewData() {
    return this.getLinkPreviewData !== undefined;
  }

  async ngOnInit() {
    await this.getLinkPreview();
  }

  async getLinkPreview() {
    const linkArray = this.postContent.match(
      /(http|https):\/\/www.[a-z]*.[a-z]*\/[a-zA-Z0-9?=]*/
    );
    if (linkArray !== null) {
      (
        await this.linkPreviewService.getLinkPreview(String(linkArray[0]))
      ).subscribe((data: any) => {
        {
          this.linkPreviewData = data;
        }
      });
    }
  }
}
