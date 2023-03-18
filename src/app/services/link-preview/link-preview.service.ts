/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

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
    this.getAPIKey().then().catch();
  }

   get apiKey() {
    return this._apiKey;
  }
   set apiKey(value) {
    this._apiKey = value;
  }

  async getAPIKey() {
    const [apiKeyVersion] =
      await new SecretManagerServiceClient().accessSecretVersion({
        name: this.secretName,
      });
    this.apiKey = apiKeyVersion.payload!.data!.toString();
    console.log(this.apiKey);
  }

  get apiKey() {
    return this._apiKey;
  }
  set apiKey(value) {
    this._apiKey = value;
  }

  getAPIKey() {
    return this.httpClient.get(
      'http://127.0.0.1:4001/jlz-portfolio/us-central1/secretService'
    );
  }

  async getLinkPreview(url: string) {
    const apiKey: any = await lastValueFrom(this.getAPIKey());

    console.log({ jsndjcksdnc: apiKey.k });
    this.params = this.params.set('key', apiKey.k).set('q', url);

    console.log({ nsjjsn: this.params });
    return this.httpClient.get(this.baseUrl, {
      params: this.params,
    });
  }
}
