 
 
import { Component, OnInit, inject, input, model } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PostType, TextPost } from 'src/app/components/models/post.model';
import { PostBaseComponent } from 'src/app/components/post-base/post-base.component';

import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'jzp-text-post',
  templateUrl: './text-post.component.html',
  styleUrls: ['./text-post.component.scss'],
  imports: [MatCardModule, PostBaseComponent],
})
export class TextPostComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  // Inputs for TextPost
  readonly title_or_uri = input<string>();
  readonly content = model.required<string>();
  readonly type = input<PostType | undefined>(); // Constrain type to PostType or undefined
  readonly created_at = input<string | null>();
  readonly updated_at = input<string | null>();
  sanitzedContent: SafeHtml;

  ngOnInit(): void {
    const contentWithClass = this.content();

    this.sanitzedContent =
      this.sanitizer.bypassSecurityTrustHtml(contentWithClass);
  }
}

// @Component({
//   selector: 'jzp-text-post',
//   templateUrl: './text-post.component.html',
//   styleUrls: ['./text-post.component.scss'],
//   imports: [MatCardModule],
// })
// export class TextPostComponent
//   extends PostBaseComponent
//   implements OnInit, TextPost
// {
//   private sanitizer = inject(DomSanitizer);

//   /** Inserted by Angular inject() migration for backwards compatibility */
//   constructor(...args: unknown[]);

//   constructor() {
//     super();
//     this.type = 'TextPost';
//   }

//   ngOnInit(): void {
//     this.content = this.sanitizer.bypassSecurityTrustHtml(this.content());
//   }
// }
