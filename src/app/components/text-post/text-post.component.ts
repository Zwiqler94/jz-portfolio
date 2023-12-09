/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TextPost } from 'src/app/components/models/post.model';
import { PostBaseComponent } from 'src/app/components/post-base/post-base.component';

@Component({
  selector: 'app-text-post',
  templateUrl: './text-post.component.html',
  styleUrls: ['./text-post.component.scss'],
})
export class TextPostComponent
  extends PostBaseComponent
  implements OnInit, TextPost
{
  constructor(private sanitizer: DomSanitizer) {
    super();
    this.type = 'TextPost';
  }

  ngOnInit(): void {
    this.content = this.sanitizer.bypassSecurityTrustHtml(this.content);
  }
}
