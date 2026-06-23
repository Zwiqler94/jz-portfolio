import { NgClass } from '@angular/common';
import {
  Component,
  DestroyRef,
  model,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { LinkPostComponent } from 'src/app/components/link-post/link-post.component';
import {
  AnyPost,
  AnyPostResponse,
  PostBase,
} from 'src/app/components/models/post.model';
import { TextPostComponent } from 'src/app/components/text-post/text-post.component';
import { DatabaseService } from 'src/app/services/database/database.service';

export type FeedState = 'loading' | 'ready' | 'empty' | 'error';

@Component({
  selector: 'jzp-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  imports: [MatCardModule, NgClass, TextPostComponent, LinkPostComponent],
})
export class FeedComponent {
  readonly posts = model<AnyPost[]>([]);
  readonly feedState = signal<FeedState>('loading');
  readonly triggerFetch = input<boolean>();

  private databaseService = inject(DatabaseService);
  private destroyRef = inject(DestroyRef);
  authService: any;
  lp: any;

  constructor() {
    this.databaseService
      .getMainPosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const sortedData = data.toSorted(this.sortPosts);
          const mappedData = sortedData.map((post) => {
            post.title_or_uri = ['TextPost', 'text'].includes(post.type)
              ? post.title
              : post.uri;
            return post;
          });
          this.posts.set(mappedData);
          this.feedState.set(mappedData.length > 0 ? 'ready' : 'empty');
        },
        error: (err) => {
          console.error('Failed to fetch posts:', err);
          this.feedState.set('error');
        },
        complete: () => console.debug('Posts fetched successfully'),
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
