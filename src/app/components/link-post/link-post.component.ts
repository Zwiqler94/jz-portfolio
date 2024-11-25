import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
  input,
} from '@angular/core';
import {
  LinkPost,
  LinkPreview,
  MissingLinkPreviewData,
  PostType,
} from 'src/app/components/models/post.model';
import { PostBaseComponent } from 'src/app/components/post-base/post-base.component';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';

import { MatCardModule } from '@angular/material/card';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-link-post',
  templateUrl: './link-post.component.html',
  styleUrls: ['./link-post.component.scss'],
  imports: [PostBaseComponent],
})
export class LinkPostComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  // Inputs for LinkPost
  readonly title_or_uri = input<string>();
  readonly content = input.required<string>();
  readonly type = input<PostType | undefined>(); // Constrain type to PostType or undefined

  // Link preview metadata
  previewData: LinkPreview = MissingLinkPreviewData;

  private linkPreviewService = inject(LinkPreviewService);
  sanitizedBackupContent: SafeHtml;

  ngOnInit() {
    this.sanitizedBackupContent = this.sanitizer.bypassSecurityTrustHtml(
      this.content(),
    );
    const linkUri = this.title_or_uri();
    if (linkUri) {
      this.linkPreviewService.getLinkPreview(linkUri).subscribe({
        next: (data) => (this.previewData = data),
        error: (err) => {
          console.error('Failed to fetch link preview:', err);
          this.previewData = MissingLinkPreviewData;
        },
      });
    }
  }
}

// @Component({
//   selector: 'app-link-post',
//   templateUrl: './link-post.component.html',
//   styleUrls: ['./link-post.component.scss'],
//   imports: [MatCardModule],
// })
// export class LinkPostComponent
//   extends PostBaseComponent
//   implements OnInit, LinkPost, OnChanges, AfterViewInit
// {
//   private linkPreviewService = inject(LinkPreviewService);
//   private authService = inject(AuthService);

//   linkPreviewData: LinkPreview;
//   uri: string;
//   image?: string;
//   updated_at?: string | undefined;
//   status?: string | undefined;

//   /** Inserted by Angular inject() migration for backwards compatibility */
//   constructor(...args: unknown[]);
//   constructor() {
//     super();
//     this.type = 'LinkPost';
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['uriInput']) {
//       this.getLinkPreview();
//     }
//   }

//   get getLinkPreviewData() {
//     return this.linkPreviewData;
//   }

//   get hasLinkPreviewData() {
//     return this.getLinkPreviewData !== undefined;
//   }

//   async ngAfterViewInit() {
//     try {
//       (await this.linkPreviewService.getAPIKey())?.subscribe(async (val) => {
//         this.linkPreviewService.apiKey = '1ba8305b83fd8470be4e9069b513094e';
//         await this.getLinkPreview();
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   async getLinkPreview() {
//     // const headers = new HttpHeaders({
//     //   'X-Firebase-AppCheck': this.authService.appCheckToken!,
//     // });

//     const linkArray = this.content.match(
//       /(http|https):\/\/(www\.)?[a-zA-Z0-9]+\.[a-zA-Z0-9]+[a-zA-Z0-9+/\-.,&?=%#(_);:~]*/,
//     );
//     if (linkArray !== null) {
//       this.uri = linkArray[0];
//       try {
//         this.linkPreviewService
//           .getLinkPreview(String(this.uri))
//           // .pipe(delay(15000))
//           .subscribe({
//             next: (data: unknown) => {
//               // {
//               this.linkPreviewData = data as LinkPreview;
//               this.title = this.linkPreviewData.title
//                 ? this.linkPreviewData.title
//                 : this.title;

//               this.content = this.linkPreviewData.description;
//               this.image = this.linkPreviewData.image;
//               // }
//             },
//             error: (err) => {
//               this.title = MissingLinkPreviewData.title;
//               this.content = MissingLinkPreviewData.description;
//               console.error(err);
//             },
//           });
//       } catch (err: any) {
//         throw new Error(err);
//       }
//     }
//   }
// }
