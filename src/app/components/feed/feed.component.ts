/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Post } from '../models/post.model';
import { DatabaseService } from 'src/app/services/database/database.service';
import { Observable } from 'rxjs';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { LinkPostComponent } from '../link-post/link-post.component';
import { TextPostComponent } from '../text-post/text-post.component';
import { NgClass, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    TextPostComponent,
    LinkPostComponent,
    MatCard,
    MatCardHeader,
    AsyncPipe,
  ],
})
export class FeedComponent implements OnInit, OnChanges {
  @Input() direction: 'H' | 'V' = 'V';
  @Input() feedLocation: string = 'Main';
  // @ViewChild('posts', { read: ViewContainerRef })
  // postTemplate: ViewContainerRef;
  // componentRef: ComponentRef<PostBaseComponent>;
  posts$: Observable<Post[]>;
  @Input() shouldFetchPosts: boolean = false;
  @Output() shouldFetchPostsChange: EventEmitter<boolean> =
    new EventEmitter<boolean>(false);

  constructor(
    private changeDetector: ChangeDetectorRef,
    public dbService: DatabaseService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shouldFetchPosts']) {
      if (this.shouldFetchPosts) {
        this.posts$ = this.dbService.mainPosts;

        this.shouldFetchPosts = !this.shouldFetchPosts;
        this.shouldFetchPostsChange.emit(this.shouldFetchPosts);
        console.table(this.posts$);
      }

      this.changeDetector.detectChanges();
    }
  }

  ngOnInit(): void {
    console.info(this.dbService.appCheck);
    this.posts$ = this.dbService.mainPosts;
    this.shouldFetchPosts = !this.shouldFetchPosts;
    this.shouldFetchPostsChange.emit(this.shouldFetchPosts);
  }

  // ngAfterViewInit(): void {
  //   // this.feedSwitchv2(this.feedLocation);
  //   // this.changeDetector.detectChanges();
  // }

  // feedSwitch(feedSwitch: string): void {
  //   if (feedSwitch === 'Main') {
  //     for (const post of staticTextPosts) {
  //       if (post.postType === 'text' && post.feedLocation === 'Main') {
  //         this.generateTextPost(post);
  //       } else if (post.postType === 'link' && post.feedLocation === 'Main') {
  //         this.generateLinkPost(post);
  //       }
  //     }
  //   } else if (feedSwitch === 'Puppy') {
  //     for (const post of staticTextPosts) {
  //       if (post.postType === 'text' && post.feedLocation === 'Puppy') {
  //         this.generateTextPost(post);
  //       }
  //     }
  //   }
  // }

  // async feedSwitchv2(feedSwitch: string) {
  //   const postLimit = 10;
  //   let posts: Post[] = [];
  //   feedSwitch = feedSwitch.toLowerCase();
  //   switch (feedSwitch) {
  //     case 'main':
  //       this.dbService.mainPosts.subscribe({
  //         next: (posts) => {
  //           from(posts).forEach((post) => {
  //             this.generatePost(post);
  //           });
  //         },
  //         error: (error) => console.log(error),
  //       });
  //       break;
  // case 'puppy':
  //   posts = await lastValueFrom(this.dbService.puppyPosts);
  //   posts.forEach((post) => {
  //     setTimeout(() => {
  //       this.generatePost(post);
  //     }, 20000);
  //   });
  //   break;
  // case 'articles':
  //   posts = await lastValueFrom(this.dbService.articlePosts);
  //   posts.forEach((post) => {
  //     setTimeout(() => {
  //       this.generatePost(post);
  //     }, 30000);
  //   });
  //   break;
  // case 'apple':
  //   posts = await lastValueFrom(this.dbService.applePosts);
  //   posts.forEach((post) => {
  //     setTimeout(() => {
  //       this.generatePost(post);
  //     }, 40000);
  //   });
  //   break;
  // case 'anime':
  //   posts = await lastValueFrom(this.dbService.animePosts);
  //   posts.forEach((post) => {
  //     this.generatePost(post);
  //   });
  //   break;
  // case 'blockchain':
  //   posts = await lastValueFrom(this.dbService.blockchainPosts);
  //   posts.forEach((post) => {
  //     this.generatePost(post);
  //   });
  //   break;
  // // case 'about':
  //   posts = []; // await lastValueFrom(this.dbService.blockchainPosts);
  //   posts.forEach((post) => {
  //     this.generatePost(post);
  //   });

  // else if (feedSwitch === 'Social') {
  //   posts = await lastValueFrom(this.dbService.social);
  //   posts.forEach((post) => {
  //     if (post.type === 'text') {
  //       this.generateTextPost(post);
  //     } else if (post.type === 'link') {
  //       this.generateLinkPost(post);
  //     }
  //   });
  // }

  // else if (feedSwitch === 'Projects') {
  //   posts: Post[] = await lastValueFrom(this.dbService.projects);
  //   posts.forEach((post) => {
  //     if (post.type === 'text') {
  //       this.generateTextPost(post);
  //     } else if (post.type === 'link') {
  //       this.generateLinkPost(post);
  //     }
  //   });
  // }}
  //   }
  // }

  // generatePost(post: Post) {
  //   switch (post.type) {
  //     case 'ImagePost':
  //     case 'VideoPost':
  //     case 'link':
  //     case 'LinkPost':
  //       this.componentRef =
  //         this.postTemplate.createComponent(LinkPostComponent);
  //       this.componentRef.instance.title = post.title;
  //       this.componentRef.instance.content = post.content;
  //       console.log(post.content);
  //       break;
  //     case 'text':
  //     case 'TextPost':
  //       this.componentRef =
  //         this.postTemplate.createComponent(TextPostComponent);
  //       this.componentRef.instance.title = post.title;
  //       this.componentRef.instance.content = post.content;
  //       console.log(post.content);
  //       break;
  //   }
  // }

  public get isHorizontal() {
    return this.direction === 'H' ? true : false;
  }

  public get isVertical() {
    return this.direction === 'V' ? true : false;
  }
}
