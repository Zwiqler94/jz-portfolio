/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TextPost } from 'src/app/components/models/post.model';
import { PostBaseComponent } from 'src/app/components/post-base/post-base.component';

import {
  MatCard,
  MatCardHeader,
  MatCardTitleGroup,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
} from '@angular/material/card';

@Component({
  selector: 'app-text-post',
  templateUrl: './text-post.component.html',
  styleUrls: ['./text-post.component.scss'],
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitleGroup,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
  ],
})
export class TextPostComponent
  extends PostBaseComponent
  implements OnInit, TextPost
{
  private sanitizer = inject(DomSanitizer);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
    this.type = 'TextPost';
  }

  ngOnInit(): void {
    this.content = this.sanitizer.bypassSecurityTrustHtml(this.content);
  }
}
