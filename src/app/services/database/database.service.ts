import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pool, ClientConfig } from 'pg';
import { lastValueFrom } from 'rxjs';
import { Post } from 'src/app/components/models/text-post';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  pool: Pool;
  mainPosts;
  puppyPosts;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private httpClient: HttpClient) {
    this.mainPosts = this.httpClient.get<Post[]>(
      'http://127.0.0.1:4001/jlz-portfolio/us-central1/jzPortfolioApp/api/v3/posts/main'
    );
     this.puppyPosts = this.httpClient.get<Post[]>(
       'http://127.0.0.1:4001/jlz-portfolio/us-central1/jzPortfolioApp/api/v3/posts/puppy'
     );
   
  }


  // dbQuery(text: string, params?: any) {
    
  //   // return this.pool.query(text, params);
  // }
}
