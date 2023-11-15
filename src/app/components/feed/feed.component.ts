/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TextPostComponent } from 'src/app/components/text-post/text-post.component';
import { Post } from '../models/post.model';
import { LinkPost } from 'src/app/components/models/link-post';
import { LinkPostComponent } from 'src/app/components/link-post/link-post.component';
import { DatabaseService } from 'src/app/services/database/database.service';
import { delay, from, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit, AfterViewInit {
  @Input() direction: 'H' | 'V' = 'V';
  @Input() feedLocation: string;
  @ViewChild('posts', { read: ViewContainerRef })
  postTemplate: ViewContainerRef;
  componentRef: ComponentRef<TextPostComponent>;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dbService: DatabaseService,
  ) {
    this.feedLocation = 'Main';
    this.dbService.mainPosts.subscribe((post) => {
      console.log(post);
    });
  }

  ngOnInit(): void {
    // this.dbService.canI();
    // this.feedSwitch(this.feedLocation);
  }

  ngAfterViewInit(): void {
    this.feedSwitchv2(this.feedLocation);
    this.changeDetector.detectChanges();
  }

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

  async feedSwitchv2(feedSwitch: string) {
    const postLimit = 10;
    feedSwitch = feedSwitch.toLowerCase();
    if (feedSwitch === 'main') {
      this.dbService.mainPosts.subscribe(
        {next:(posts) => {
        from(posts).pipe(delay(10000)).forEach((post) => {
         if (post.type === 'text') {
           this.generateTextPost(post);
         } else if (post.type === 'link') {
           this.generateLinkPost(post);
         }
      })
        },
        error: (error)=>console.log(error)}
      )
   
    } else if (feedSwitch === 'puppy') {
      const posts: Post[] = await lastValueFrom(this.dbService.puppyPosts);
      posts.forEach((post) => {
        setTimeout(() => {
          if (post.type === 'text') {
            this.generateTextPost(post);
          } else if (post.type === 'link') {
            this.generateLinkPost(post);
          }
        }, 20000);
      });
    } else if (feedSwitch === 'articles') {
      const posts: Post[] = await lastValueFrom(this.dbService.articlePosts);
      posts.forEach((post) => {
        setTimeout(() => {
          if (post.type === 'text') {
            this.generateTextPost(post);
          } else if (post.type === 'link') {
            this.generateLinkPost(post);
          }
        }, 30000);
      });
    } else if (feedSwitch === 'apple') {
      const posts: Post[] = await lastValueFrom(this.dbService.applePosts);
      posts.forEach((post) => {
        setTimeout(() => {
          if (post.type === 'text') {
            this.generateTextPost(post);
          } else if (post.type === 'link') {
            this.generateLinkPost(post);
          }
        }, 40000);
      });
    } else if (feedSwitch === 'anime') {
      const posts: Post[] = await lastValueFrom(this.dbService.animePosts);
      posts.forEach((post) => {
        if (post.type === 'text') {
          this.generateTextPost(post);
        } else if (post.type === 'link') {
          this.generateLinkPost(post);
        }
      });
    } else if (feedSwitch === 'blockchain') {
      const posts: Post[] = await lastValueFrom(this.dbService.blockchainPosts);
      posts.forEach((post) => {
        if (post.type === 'text') {
          this.generateTextPost(post);
        } else if (post.type === 'link') {
          this.generateLinkPost(post);
        }
      });
    } else if (feedSwitch === 'about') {
      const posts: Post[] = []; // await lastValueFrom(this.dbService.blockchainPosts);
      posts.forEach((post) => {
        if (post.type === 'text') {
          this.generateTextPost(post);
        } else if (post.type === 'link') {
          this.generateLinkPost(post);
        }
      });
    }
    // else if (feedSwitch === 'Social') {
    //   const posts: Post[] = await lastValueFrom(this.dbService.social);
    //   posts.forEach((post) => {
    //     if (post.type === 'text') {
    //       this.generateTextPost(post);
    //     } else if (post.type === 'link') {
    //       this.generateLinkPost(post);
    //     }
    //   });
    // }

    // else if (feedSwitch === 'Projects') {
    //   const posts: Post[] = await lastValueFrom(this.dbService.projects);
    //   posts.forEach((post) => {
    //     if (post.type === 'text') {
    //       this.generateTextPost(post);
    //     } else if (post.type === 'link') {
    //       this.generateLinkPost(post);
    //     }
    //   });
    // }
  }

  generateTextPost(textPost: Post) {
    this.componentRef = this.postTemplate.createComponent(TextPostComponent);
    this.componentRef.instance.postTitle = textPost.title;
    this.componentRef.instance.postContent = textPost.content;
  }
  generateLinkPost(linkPost: LinkPost) {
    this.componentRef = this.postTemplate.createComponent(LinkPostComponent);
    this.componentRef.instance.postTitle = linkPost.title;
    this.componentRef.instance.postContent = linkPost.content;
  }
  // generateImagePost() {}
  // generateVideoPost() {}

  public get isHorizontal() {
    return this.direction === 'H' ? true : false;
  }

  public get isVertical() {
    return this.direction === 'V' ? true : false;
  }
}
