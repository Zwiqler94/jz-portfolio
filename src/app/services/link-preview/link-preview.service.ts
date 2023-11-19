/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Injectable, inject } from '@angular/core';
import { AppCheck, getToken } from '@angular/fire/app-check';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppCheckTokenResult } from 'firebase/app-check';
import { LinkPreview } from 'src/app/components/models/link-post';
import { appCheck } from 'firebase-admin';

interface SecretResponse {
  k: string;
}

@Injectable({
  providedIn: 'root',
})
export class LinkPreviewService {
  private _appCheck: AppCheck;
  private baseUrl = 'https://api.linkpreview.net/';
  private _apiKey!: string;
  private params: HttpParams = new HttpParams().set('key', this.apiKey);
  private tokenResult: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(private httpClient: HttpClient, appCheck: AppCheck) {
    try {
      this.appCheck = appCheck;
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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get apiKey() {
    return this._apiKey;
  }

  set apiKey(value) {
    this._apiKey = value;
  }

  async getAppCheckToken(): Promise<string | AppCheckTokenResult | undefined> {
    try {
      if (!environment.local && this.appCheck) {
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

  getAPIKey() {
    this.params = new HttpParams();
    if (!environment.local)
      this.headers = this.headers.set('X-Firebase-AppCheck', this.tokenResult);
    console.log(this.headers);
    this.params = this.params.set('prod', environment.production);
    let secretsUrl = environment.serviceOptions.secretService;
    secretsUrl += '/link-previews';
    console.info(secretsUrl);
    return this.httpClient.get<SecretResponse>(secretsUrl, {
      params: this.params,
      headers: this.headers,
    });
  }

  async getLinkPreview(url: string) {
    await this.getAppCheckToken();
    console.info(url);
    this.params = new HttpParams();
    if (!environment.local)
      this.headers = this.headers.set('X-Firebase-AppCheck', this.tokenResult);

    try {
      const apiKey: SecretResponse = await lastValueFrom(this.getAPIKey());
      console.info(apiKey);
      this.params = this.params.set('key', apiKey.k).set('q', url);
      console.info(this.params);
      return this.httpClient.get<LinkPreview>(this.baseUrl, {
        params: this.params,
        headers: this.headers,
      });
    } catch (err) {
      console.error(err);
      throw Error(JSON.stringify(err));
    }
  }
}
