import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PostType } from 'src/app/components/models/post.model';

@Component({
  selector: 'app-post-base',
  templateUrl: './post-base.component.html',
  styleUrls: ['./post-base.component.scss'],
  imports: [MatCardModule, DatePipe],
})
export class PostBaseComponent {
  readonly type = input<PostType | undefined>();
  readonly title = input<string>();
  readonly content = input<string>();
  readonly uri = input<string | null>();
  readonly location = input<string>();
  readonly created_at = input<string | null>();
  readonly updated_at = input<string | null>();

  readonly displayTitle = computed(() => this.title() || 'Untitled Post');
  readonly displayLocation = computed(() => this.location() || 'Unknown');
}

// @Component({
//   selector: 'app-post-base',
//   templateUrl: './post-base.component.html',
//   styleUrls: ['./post-base.component.scss'],
// })
// export class PostBaseComponent implements PostBase {
//   readonly createdAtInput = input<string>();
//   readonly titleInput = input<string>();
//   readonly subTitleInput = input<string>();
//   readonly contentInput = input.required<any>();
//   readonly typeInput = input<PostType>();
//   readonly locationInput = input<string>();
//   readonly uriInput = input<string>();
//   readonly videoInput = input<string>();
//   readonly imageInput = input<string>();

//   title: string;
//   content: any;
//   type: PostType = 'TextPost';
//   location: string = 'Main';
//   subTitle?: string;
//   uri?: string;
//   video?: string;
//   image?: string;
//   created_at?: string;

//   ngOnInit() {
//     this.created_at = this.createdAtInput();
//     this.title = this.titleInput() ?? this.title;
//     this.subTitle = this.subTitleInput();
//     this.content = this.contentInput();
//     this.type = this.typeInput() ?? this.type;
//     this.location = this.locationInput() ?? this.location;
//     this.uri = this.uriInput();
//     this.video = this.videoInput();
//     this.image = this.imageInput();
//   }
// }
