/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
// import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

@Injectable({
  providedIn: 'root',
})
export class LinkPreviewService {
  private baseUrl = 'https://api.linkpreview.net/';
  private secretName =
    'projects/518070660509/secrets/LINK_PREVIEW_DEV/versions/latest';
  private _apiKey = '';
  private params: HttpParams = new HttpParams().set('key', this.apiKey);

  constructor(private httpClient: HttpClient) {
    // this.getAPIKey().then().catch();
  }

  get apiKey() {
    return this._apiKey;
  }
  set apiKey(value) {
    this._apiKey = value;
  }

  // async getAPIKey() {
  //   const [apiKeyVersion] =
  //     await new SecretManagerServiceClient().accessSecretVersion({
  //       name: this.secretName,
  //     });
  //   this.apiKey = apiKeyVersion.payload!.data!.toString();
  //   console.log(this.apiKey);
  // }

  getLinkPreview(url: string) {
    this.params = this.params.set('q', url);
    return this.httpClient.get(this.baseUrl, {
      params: this.params,
    });
  }
}
