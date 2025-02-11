import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PostType } from 'src/app/components/models/post.model';

@Component({
  selector: 'jzp-post-base',
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
