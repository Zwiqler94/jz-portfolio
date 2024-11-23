import { Component, input } from '@angular/core';
import { PostBase, PostType } from 'src/app/components/models/post.model';

@Component({
  selector: 'app-post-base',
  templateUrl: './post-base.component.html',
  styleUrls: ['./post-base.component.scss'],
  standalone: true,
})
export class PostBaseComponent implements PostBase {
  readonly createdAtInput = input<string>();
  readonly titleInput = input.required<string>();
  readonly subTitleInput = input<string>();
  readonly contentInput = input.required<any>();
  readonly typeInput = input<PostType>();
  readonly locationInput = input<string>();
  readonly uriInput = input<string>();
  readonly videoInput = input<string>();
  readonly imageInput = input<string>();

  title: string;
  content: any;
  type: PostType = 'TextPost';
  location: string = 'Main';
  subTitle?: string;
  uri?: string;
  video?: string;
  image?: string;
  created_at?: string;

  constructor() {
    this.created_at = this.createdAtInput();
    this.title = this.titleInput();
    this.subTitle = this.subTitleInput();
    this.content = this.contentInput();
    this.type = this.typeInput() ?? this.type;
    this.location = this.locationInput() ?? this.location;
    this.uri = this.uriInput();
    this.video = this.videoInput();
    this.image = this.imageInput();
  }
}
