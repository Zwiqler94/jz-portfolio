import { Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Post, PostBase, PostType } from 'src/app/components/models/post.model';
import { TextPostComponent } from 'src/app/components/text-post/text-post.component';

@Component({
  selector: 'app-post-base',
  templateUrl: './post-base.component.html',
  styleUrls: ['./post-base.component.scss'],
})
export class PostBaseComponent implements PostBase {
  @Input() title: string;
  @Input() subTitle?: string | undefined;
  @Input() content: any;
  @Input() type: PostType;
  @Input() location: string;
  @Input() uri?: string | undefined;
  @Input() video?: string | undefined;
  @Input() image?: string | undefined;
}
