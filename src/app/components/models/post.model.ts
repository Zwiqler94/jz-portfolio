/* eslint-disable */
export interface PostBase {
  type: PostType;
  title: string;
  content: string;
  location: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

export interface LinkPost extends PostBase {
  uri: string;
}

export type TextPost = PostBase;

export interface ImagePost extends PostBase {
  image: string;
}

export interface VideoPost extends PostBase {
  video: string;
}

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

export type PostType =
  | 'LinkPost'
  | 'link'
  | 'TextPost'
  | 'text'
  | 'ImagePost'
  | 'VideoPost';
export type Post = TextPost | LinkPost | ImagePost | VideoPost;
