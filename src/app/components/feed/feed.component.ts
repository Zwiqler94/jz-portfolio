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
import { TextPost } from '../models/text-post';
import { staticTextPosts } from '../../pages/staticTextPosts';
import { LinkPost } from 'src/app/components/models/link-post';
import { LinkPostComponent } from 'src/app/components/link-post/link-post.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit, AfterViewInit {
  @Input() feedLocation: string;
  @ViewChild('posts', { read: ViewContainerRef })
  postTemplate: ViewContainerRef;
  componentRef: ComponentRef<TextPostComponent>;

  constructor(private changeDetector: ChangeDetectorRef) {
    this.feedLocation = 'Main';
  }

  ngOnInit(): void {
    // this.feedSwitch(this.feedLocation);
  }

  ngAfterViewInit(): void {
    this.feedSwitch(this.feedLocation);
    this.changeDetector.detectChanges();
  }

  feedSwitch(feedSwitch: string): void {
    if (feedSwitch === 'Main') {
      for (const post of staticTextPosts) {
        if (post.postType === 'text' && post.feedLocation === 'Main') {
          this.generateTextPost(post);
        } else if (post.postType === 'link' && post.feedLocation === 'Main') {
          this.generateLinkPost(post);
        }
      }
    } else if (feedSwitch === 'Puppy') {
      for (const post of staticTextPosts) {
        if (post.postType === 'text' && post.feedLocation === 'Puppy') {
          this.generateTextPost(post);
        }
      }
    }
  }
  generateTextPost(textPost: TextPost) {
    this.componentRef = this.postTemplate.createComponent(TextPostComponent);
    this.componentRef.instance.postTitle = textPost.title;
    this.componentRef.instance.postContent = textPost.content;
  }
  generateLinkPost(linkPost: LinkPost) {
    this.componentRef = this.postTemplate.createComponent(LinkPostComponent);
    this.componentRef.instance.postTitle = linkPost.title;
    this.componentRef.instance.postContent = linkPost.content;
  }
  generateImagePost() {}
  generateVideoPost() {}
}
