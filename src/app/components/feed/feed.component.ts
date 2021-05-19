import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactory, ComponentFactoryResolver,
   ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TextPostComponent } from 'src/app/components/text-post/text-post.component';
import { testPosts } from '../../pages/testTextPost';

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
      for (const testPost of testPosts) {
        this.componentFactory = this.componentFactoryResovler.resolveComponentFactory(TextPostComponent);
        this.componentRef = this.postTemplate.createComponent(this.componentFactory);
        this.componentRef.instance.postTitle = testPost.title;
        this.componentRef.instance.postContent = testPost.content;
      }
      // console.log(this.componentRef);

    }
  }

}
