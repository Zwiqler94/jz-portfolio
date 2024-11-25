// Enum for post types
export enum PostType {
  TextPost = 'TextPost',
  LinkPost = 'LinkPost',
  ImagePost = 'ImagePost',
  VideoPost = 'VideoPost',
  text = 'text',
  link = 'link',
}

export interface PostBase {
  id: number;
  type: PostType;
  content: string;
  location: string;
  created_at?: string;
  updated_at?: string;
  status?: string; // Add this line
  title_or_uri: string;
}

// Extended types for specific post properties
export interface LinkPost extends PostBase {
  type: PostType.LinkPost | PostType.link;
}

export interface ImagePost extends PostBase {
  type: PostType.ImagePost;
  image: string;
}

export interface VideoPost extends PostBase {
  type: PostType.VideoPost;
  video: string;
}

export interface TextPost extends PostBase {
  type: PostType.TextPost | PostType.text;
}

// Union type for all posts
export type AnyPost = TextPost | LinkPost | ImagePost | VideoPost;

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
