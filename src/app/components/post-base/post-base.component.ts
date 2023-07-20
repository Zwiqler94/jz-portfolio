import { Component, Input, OnInit } from '@angular/core';
import { LinkPreview } from 'src/app/components/models/link-post';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';

@Component({
  selector: 'app-post-base',
  templateUrl: './post-base.component.html',
  styleUrls: ['./post-base.component.scss'],
})
export class PostBaseComponent {
  @Input() postTitle: string;
  @Input() postContent: string;
}
