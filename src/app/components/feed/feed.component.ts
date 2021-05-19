import { AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TextPostComponent } from 'src/app/components/text-post/text-post.component';
import { testPost } from '../../pages/testTextPost';
;
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, AfterViewInit {

  //textPostFactory = new ComponentFactoryResolver(TextPostComponent);
  @Input() feedLocation: String;
  @ViewChild('posts', { read: ViewContainerRef }) postTemplate: ViewContainerRef;
  componentFactory: ComponentFactory<TextPostComponent>;
  componentRef: ComponentRef<TextPostComponent>;

  constructor(private componentFactoryResovler: ComponentFactoryResolver) {
    this.feedLocation = "Main";
  }

  ngOnInit(): void {
    //this.feedSwitch(this.feedLocation);
  }

  ngAfterViewInit() {
    this.componentFactory = this.componentFactoryResovler.resolveComponentFactory(TextPostComponent);
    this.componentRef = this.postTemplate.createComponent(this.componentFactory);
    this.componentRef.instance.post = { title: testPost.title, content: testPost.content };
  }

  feedSwitch(feedSwitch: String): void {
    if (feedSwitch == 'Main') {

    }
  }

}
