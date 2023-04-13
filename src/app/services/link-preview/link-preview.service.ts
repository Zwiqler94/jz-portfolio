/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Injectable, inject } from '@angular/core';
import { AppCheck, getToken } from '@angular/fire/app-check';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppCheckTokenResult } from 'firebase/app-check';
import {
  generateKeyPair,
  exportJWK,
  SignJWT,
  KeyLike,
  importJWK,
  exportPKCS8,
  exportSPKI,
} from 'jose';
import exp from 'constants';
import { writeFile } from 'fs/promises';
import { blob } from 'stream/consumers';

@Injectable({
  providedIn: 'root',
})
export class LinkPreviewService {
  private baseUrl = 'https://api.linkpreview.net/';
  private _apiKey!: string;
  private params: HttpParams = new HttpParams().set('key', this.apiKey);
  private appCheck: AppCheck = inject(AppCheck);
  private tokenResult: any;

  constructor(private httpClient: HttpClient) {}

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
    return this.httpClient.get(
      environment.local
        ? environment.secretServiceLocal
        : environment.secretService,
      { params, headers }
    );
  }

  async getLinkPreview(url: string) {
    await this.getAppCheckToken();
    const apiKey: any = await lastValueFrom(this.getAPIKey());
    this.params = this.params.set('key', apiKey.k).set('q', url);
    return this.httpClient.get(this.baseUrl, {
      params: this.params,
    });
  }

  private async getDebugToken(publickKey: any, privateKey: any) {
    const b = new Blob([JSON.stringify(await exportSPKI(publickKey))], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(b);
    link.download = 'key';
    link.click();
    document.body.appendChild(link);
    return await new SignJWT({
      aud: 'projects/jlz-portfolio',
      token: environment.appCheckDebug as unknown as string,
    })
      .setProtectedHeader({
        alg: 'RS256',
        kid: 'fB7E6w',
      })
      .setIssuer('https://firebaseappcheck.googleapis.com/')
      .setAudience(['projects/jlz-portfolio'])
      .setSubject('jazwickler@gmail.com')
      .sign(privateKey);
  }
}
