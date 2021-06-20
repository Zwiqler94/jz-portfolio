import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LinkPreviewService {

  private baseUrl = "http://api.linkpreview.net/";
  private apiKey = "cc4eae4652214d3001c57dbcf92670c8";
  private params: HttpParams = new HttpParams().set("key", this.apiKey);



  constructor(private httpClient: HttpClient) { }

  getLinkPreview(url: string) {
   
    this.params = this.params.set('q',url);
    console.log(this.params)
    return this.httpClient.get(this.baseUrl, {params: this.params});
  }

}
