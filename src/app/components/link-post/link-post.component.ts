import { Component, Input, OnInit } from '@angular/core';
import { LinkPreviewService } from 'src/app/services/link-preview.service';


@Component({
  selector: 'app-link-post',
  templateUrl: './link-post.component.html',
  styleUrls: ['./link-post.component.scss']
})
export class LinkPostComponent implements OnInit {

  @Input() postTitle: string;
  @Input() postContent: string;
  linkPreviewData: any;

  constructor(private linkPreviewService: LinkPreviewService) {

  }

  ngOnInit(): void {
    this.getLinkPreview();
  }

  getLinkPreview() {
    const linkArray = this.postContent.match(/(http|https):\/\/www.[a-z]*.[a-z]*\/[a-zA-z0-9?=]*/);
    if (linkArray !== null) {
      this.linkPreviewService.getLinkPreview(String(linkArray[0])).subscribe((data: any)=>{
        {
          this.linkPreviewData = data;
        }
      });
    }
  }

  get getLinkPreviewData(){
    return this.linkPreviewData;
  }

  get hasLinkPreviewData(){
    return this.getLinkPreviewData !== undefined;
  }

}
