import {
  AfterViewInit, ChangeDetectorRef, Component, ComponentFactory, ComponentFactoryResolver,
  ComponentRef, Input, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import { TextPostComponent } from 'src/app/components/text-post/text-post.component';
import { TextPost } from '../models/text-post';
import { staticTextPosts } from '../../pages/staticTextPosts';
import { LinkPost } from 'src/app/components/models/link-post';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, AfterViewInit {


  @Input() feedLocation: string;
  @ViewChild('posts', { read: ViewContainerRef }) postTemplate: ViewContainerRef;
  componentFactory: ComponentFactory<TextPostComponent>;
  componentRef: ComponentRef<TextPostComponent>;

  constructor(private componentFactoryResovler: ComponentFactoryResolver, private changeDetector: ChangeDetectorRef) {
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
        if (post.postType === 'text' && post.feedLocation === 'Main'){
          this.generateTextPost(post);
        } else if (post.postType === 'link' && post.feedLocation === 'Main'){
          this.generateLinkPost(post);
        }
      }
    }
    else if(feedSwitch === 'Puppy' ){
      for (const post of staticTextPosts) {
        if (post.postType === 'text' && post.feedLocation === 'Puppy'){
          this.generateTextPost(post);
        }
      }
    }
  }
  generateTextPost(textPost: TextPost) {
    this.componentFactory = this.componentFactoryResovler.resolveComponentFactory(TextPostComponent);
    this.componentRef = this.postTemplate.createComponent(this.componentFactory);
    this.componentRef.instance.postTitle = textPost.title;
    this.componentRef.instance.postContent = textPost.content;
  }
  generateLinkPost(linkPost: LinkPost) {
    this.componentFactory = this.componentFactoryResovler.resolveComponentFactory(TextPostComponent);
    this.componentRef = this.postTemplate.createComponent(this.componentFactory);
    this.componentRef.instance.postTitle = linkPost.title;
    this.componentRef.instance.postContent = linkPost.content;
  }
  generateImagePost() {

  }
  generateVideoPost() {

  }
}

