import { Post } from 'src/app/components/models/post.model';
import { LinkPreviewService } from 'src/app/services/link-preview/link-preview.service';

export type LinkPost = Post;

export interface LinkPreview {
  title: string;
  description: string;
  url: string;
  image: string;
}

export const MissingLinkPreviewData: LinkPreview = {
  title: 'Link Preview Unavailable',
  image: '',
  url: '',
  description: 'Link Preview Unavailable',
};
