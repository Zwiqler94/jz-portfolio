import { Post } from 'src/app/components/models/post.model';

export type LinkPost = Post;

export interface LinkPreview {
  title: string;
  description: string;
  url: string;
  image: string;
}
