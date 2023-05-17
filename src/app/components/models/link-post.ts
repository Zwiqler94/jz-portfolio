export interface LinkPost {
  feedLocation: string;
  postType: string;
  title: string;
  content: string;
  url?: string;
}

export interface LinkPreview {
  title: string;
  description: string;
  url: string;
  image: string;
}