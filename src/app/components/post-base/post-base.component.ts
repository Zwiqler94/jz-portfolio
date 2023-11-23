import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-base',
  templateUrl: './post-base.component.html',
  styleUrls: ['./post-base.component.scss'],
})
export class PostBaseComponent {
  @Input() postTitle: string;
  @Input() postContent: string;
}
