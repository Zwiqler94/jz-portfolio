/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Injectable, inject } from '@angular/core';
import { AppCheck, getToken } from '@angular/fire/app-check';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppCheckTokenResult } from 'firebase/app-check';
import { error, info } from 'console';
// import { DateTime, Duration } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class LinkPreviewService {
  private _appCheck: AppCheck;
  private baseUrl = 'https://api.linkpreview.net/';
  private _apiKey!: string;
  private params: HttpParams = new HttpParams().set('key', this.apiKey);
  private tokenResult: any;

  constructor(private httpClient: HttpClient) {
    try {
      this.appCheck = inject(AppCheck);
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
      info(this.appCheck);
      this.tokenResult = (await getToken(this.appCheck)).token;
      info(this.tokenResult);
    } catch (err) {
      error(err);
    }
    return this.tokenResult;
  }

  getAPIKey() {
    const headers = new HttpHeaders()
      .set('X-Firebase-AppCheck-Debug', this.tokenResult)
    const params = new HttpParams().set('prod', environment.production);
    const secretsUrl = environment.local
      ? environment.secretServiceLocal
      : environment.secretService;
    info(secretsUrl);
    return this.httpClient.get(secretsUrl, { params, headers });
  }

  async getLinkPreview(url: string) {
    info(url)
    try {
      await this.getAppCheckToken();
      const apiKey: any = await lastValueFrom(this.getAPIKey());
      info(apiKey);
      this.params = this.params.set('key', apiKey.k).set('q', url);
      return this.httpClient.get(this.baseUrl, {
        params: this.params,
      });
    } catch (err) {
      error(err);
      throw Error(JSON.stringify(err));
    }
  }
}
