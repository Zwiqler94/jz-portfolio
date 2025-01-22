import { Component, Input } from '@angular/core';
import { PostBase, PostType } from 'src/app/components/models/post.model';

@Component({
  selector: 'app-post-base',
  templateUrl: './post-base.component.html',
  styleUrls: ['./post-base.component.scss'],
  standalone: true,
})
export class PostBaseComponent implements PostBase {
  @Input() created_at: string;
  @Input() title: string;
  @Input() subTitle?: string | undefined;
  @Input() content: any;
  @Input() type: PostType;
  @Input() location: string;
  @Input() uri?: string | undefined;
  @Input() video?: string | undefined;
  @Input() image?: string | undefined;
}
