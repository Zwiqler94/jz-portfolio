/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LinkPreviewService {
  private baseUrl = 'https://api.linkpreview.net/';
  private _apiKey!: string;
  private params: HttpParams = new HttpParams().set('key', this.apiKey);

  constructor(private httpClient: HttpClient) {}

  get apiKey() {
    return this._apiKey;
  }
  set apiKey(value) {
    this._apiKey = value;
  }

  getAPIKey() {
    const params = new HttpParams().set('prod', environment.production);
    return this.httpClient.get(
      environment.local
        ? environment.secretServiceLocal
        : environment.secretService,
      { params }
    );
  }

  async getLinkPreview(url: string) {
    const apiKey: any = await lastValueFrom(this.getAPIKey());
    this.params = this.params.set('key', apiKey.k).set('q', url);

    return this.httpClient.get(this.baseUrl, {
      params: this.params,
    });
  }
}
