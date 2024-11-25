import { NgClass } from '@angular/common';
import {
  Component,
  model,
  inject,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LinkPostComponent } from 'src/app/components/link-post/link-post.component';
import {
  AnyPost,
  AnyPostResponse,
  PostBase,
} from 'src/app/components/models/post.model';
import { TextPostComponent } from 'src/app/components/text-post/text-post.component';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'jzp-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  imports: [MatCardModule, NgClass, TextPostComponent, LinkPostComponent],
})
export class FeedComponent {
  readonly posts = model<AnyPost[]>([]);
  readonly triggerFetch = input<boolean>();

  private databaseService = inject(DatabaseService);
  authService: any;
  lp: any;

  constructor() {
    this.databaseService.getMainPosts().subscribe({
      next: (data) => {
        const sortedData = data.toSorted(this.sortPosts);
        const mappedData = sortedData.map((post) => {
          post.title_or_uri = ['TextPost', 'text'].includes(post.type)
            ? post.title
            : post.uri;
          return post;
        });
        this.posts.set(mappedData);
      },
      error: (err) => console.error('Failed to fetch posts:', err),
    });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   // this.databaseService.getMainPosts().subscribe({
  //   //   next: (data) => {
  //   //     const sortedData = data.sort((a, b) =>
  //   //       a.id > b.id ? -1 : a.id < b.id ? 1 : 0,
  //   //     );
  //   //     this.posts.set(sortedData);
  //   //   },
  //   //   error: (err) => console.error('Failed to lastest posts:', err),
  //   // });
  // }

  // clear() {
  //   this.posts.set([]);
  // }

  sortPosts(a: AnyPostResponse, b: AnyPostResponse) {
    return a.id > b.id ? -1 : a.id < b.id ? 1 : 0;
  }

  isTextPost(post: PostBase): boolean {
    return post.type === 'TextPost';
  }

  isLinkPost(post: PostBase): boolean {
    return post.type === 'LinkPost';
  }

  trackByPostId(index: number, post: PostBase): number {
    return post.id; // Assuming `id` exists on PostBase
  }
}

// /* eslint-disable @angular-eslint/no-empty-lifecycle-method */
// import {
//   ChangeDetectorRef,
//   Component,
//   EventEmitter,
//   OnChanges,
//   OnInit,
//   Output,
//   SimpleChanges,
//   AfterViewInit,
//   inject,
//   input,
// } from '@angular/core';
// import { Post } from '../models/post.model';
// import { DatabaseService } from 'src/app/services/database/database.service';
// import { Observable } from 'rxjs';
// import { MatCardModule } from '@angular/material/card';
// import { LinkPostComponent } from '../link-post/link-post.component';
// import { TextPostComponent } from '../text-post/text-post.component';
// import { NgClass, AsyncPipe } from '@angular/common';

// @Component({
//   selector: 'app-feed',
//   templateUrl: './feed.component.html',
//   styleUrls: ['./feed.component.scss'],
//   imports: [
//     NgClass,
//     TextPostComponent,
//     LinkPostComponent,
//     MatCardModule,
//     AsyncPipe,
//   ],
// })
// export class FeedComponent implements OnInit {
//   dbService = inject(DatabaseService);

//   readonly direction = input<'H' | 'V'>('V');
//   readonly feedLocation = input<string>('Main');
//   // @ViewChild('posts', { read: ViewContainerRef })
//   // postTemplate: ViewContainerRef;
//   // componentRef: ComponentRef<PostBaseComponent>;
//   posts$: Observable<Post[]>;
//   readonly shouldFetchPosts = input<boolean>(false);
//   @Output() shouldFetchPostsChange: EventEmitter<boolean> =
//     new EventEmitter<boolean>(false);

//   ngOnInit() {
//     this.posts$ = this.dbService.getMainPosts();
//   }

//   public get isHorizontal() {
//     return this.direction() === 'H' ? true : false;
//   }

//   public get isVertical() {
//     return this.direction() === 'V' ? true : false;
//   }
// }
