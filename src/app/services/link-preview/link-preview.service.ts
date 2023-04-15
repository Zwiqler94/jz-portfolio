/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Injectable, inject } from '@angular/core';
import { AppCheck, getToken } from '@angular/fire/app-check';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppCheckTokenResult } from 'firebase/app-check';

@Injectable({
  providedIn: 'root',
})
export class LinkPreviewService {
  private baseUrl = 'https://api.linkpreview.net/';
  private _apiKey!: string;
  private params: HttpParams = new HttpParams().set('key', this.apiKey);
  private appCheck: AppCheck = inject(AppCheck);
  private tokenResult: any;

  constructor(private httpClient: HttpClient) {
    localStorage.setItem('DEBUG_TOKEN_INFO',JSON.stringify({tokenVal: environment.appCheckDebug, created_at: Date.now()}))
  }

  get apiKey() {
    return this._apiKey;
  }
  set apiKey(value) {
    this._apiKey = value;
  }

  async getAppCheckToken(): Promise<string | AppCheckTokenResult | undefined> {
    console.log('hdhdhdh');
    // const { publicKey, privateKey } = await generateKeyPair('RS256',{extractable:true});
    // console.log(publicKey, privateKey);
    const isOnDebugMode: boolean | string = environment.appCheckDebug;
    this.tokenResult = { token: isOnDebugMode };
    try {
      if (isOnDebugMode) {
        this.tokenResult = { token: isOnDebugMode };
      } else {
        this.tokenResult = await getToken(this.appCheck);
      }
      return this.tokenResult.token;
    } catch (error) {
      console.log(error);
      throw new Error(JSON.stringify(error));
    }
  }

  getAPIKey() {
    const headers = new HttpHeaders().set(
      'X-Firebase-AppCheck',
      this.tokenResult
    );
    const params = new HttpParams().set('prod', environment.production);
    const secretsUrl = environment.local
      ? environment.secretServiceLocal
      : environment.secretService;
    return this.httpClient.get(secretsUrl, { params, headers });
  }

  async getLinkPreview(url: string) {
    await this.getAppCheckToken();
    const apiKey: any = await lastValueFrom(this.getAPIKey());
    this.params = this.params.set('key', apiKey.k).set('q', url);
    return this.httpClient.get(this.baseUrl, {
      params: this.params,
    });
  }

  private async getDebugToken() {
  
    if(localStorage.getItem(''))
  }
}
