import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LinkPreviewService {
  private baseUrl = 'https://api.linkpreview.net/';
  private apiKey = 'cc4eae4652214d3001c57dbcf92670c8';
  private params: HttpParams = new HttpParams().set('key', this.apiKey);

  constructor(private httpClient: HttpClient) {}

  getLinkPreview(url: string) {
    this.params = this.params.set('q', url);
    return this.httpClient.get(this.baseUrl, { params: this.params });
  }
}
