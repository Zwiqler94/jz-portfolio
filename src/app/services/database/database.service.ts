import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from 'src/app/components/models/text-post';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  mainPosts;
  puppyPosts;
  articlePosts;
  applePosts;
  animePosts;
  blockchainPosts;

  postUrl = environment.production
    ? environment.postService
    : environment.postServiceLocal;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private httpClient: HttpClient) {
    this.mainPosts = this.httpClient.get<Post[]>(`${this.postUrl}/main`);
    this.puppyPosts = this.httpClient.get<Post[]>(`${this.postUrl}/puppy`);
    this.articlePosts = this.httpClient.get<Post[]>(`${this.postUrl}/articles`);
    this.applePosts = this.httpClient.get<Post[]>(`${this.postUrl}/apple`);
    this.animePosts = this.httpClient.get<Post[]>(`${this.postUrl}/anime`);
    this.blockchainPosts = this.httpClient.get<Post[]>(
      `${this.postUrl}/blockchain`,
    );
  }
}
