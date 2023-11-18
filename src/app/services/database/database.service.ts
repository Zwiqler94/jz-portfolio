import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  AppCheck,
  AppCheckTokenResult,
  getToken,
} from '@angular/fire/app-check';
import { Observable } from 'rxjs';
import { Post } from 'src/app/components/models/post.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  mainPosts: Observable<Post[]>;
  puppyPosts: Observable<Post[]>;
  articlePosts: Observable<Post[]>;
  applePosts: Observable<Post[]>;
  animePosts: Observable<Post[]>;
  blockchainPosts: Observable<Post[]>;

  postUrl = environment.serviceOptions.postService;
  _appCheck: any;
  tokenResult: string;

  headers: HttpHeaders = new HttpHeaders();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private httpClient: HttpClient) {
    this.setDBUrls();
    try {
      this.appCheck = inject(AppCheck);
      if (environment.local && typeof environment.appCheckDebug === 'string') {
        this.headers = new HttpHeaders().set(
          'X-Firebase-AppCheck-Debug',
          environment.appCheckDebug
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  get appCheck() {
    return this._appCheck;
  }

  set appCheck(x) {
    this._appCheck = x;
  }

  async getAppCheckToken(): Promise<string | AppCheckTokenResult | undefined> {
    try {
      if (!environment.local) {
        console.info(this.appCheck);
        this.tokenResult = (await getToken(this.appCheck)).token;
        console.info(this.tokenResult);
      } else {
        return '';
      }
    } catch (err) {
      console.error(err);
    }
    return this.tokenResult;
  }

  private async setDBUrls() {
    await this.getAppCheckToken();
    if (!environment.local)
      this.headers = this.headers.set('X-Firebase-AppCheck', this.tokenResult);
    console.log(this.headers);
    this.mainPosts = this.httpClient.get<Post[]>(`${this.postUrl}/main`, {
      headers: this.headers,
    });
    this.puppyPosts = this.httpClient.get<Post[]>(`${this.postUrl}/puppy`, {
      headers: this.headers,
    });
    this.articlePosts = this.httpClient.get<Post[]>(
      `${this.postUrl}/articles`,
      { headers: this.headers }
    );
    this.applePosts = this.httpClient.get<Post[]>(`${this.postUrl}/apple`, {
      headers: this.headers,
    });
    this.animePosts = this.httpClient.get<Post[]>(`${this.postUrl}/anime`, {
      headers: this.headers,
    });
    this.blockchainPosts = this.httpClient.get<Post[]>(
      `${this.postUrl}/blockchain`,
      { headers: this.headers }
    );
  }
}
