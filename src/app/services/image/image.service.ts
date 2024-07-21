import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CloudinaryApiResponse } from 'src/app/interfaces/cloudinary-search.interface';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private httpClient: HttpClient) {}

  getHuxleyImageInfo() {
    return this.httpClient.get<CloudinaryApiResponse>(
      'https://res.cloudinary.com/dhdioy0wn/search/81ee7fd17ffd0c1e5aa8db7f47c88ec9a519613cab618f1a4ffaa98026dba020/300/eyJleHByZXNzaW9uIjoicmVzb3VyY2VfdHlwZTppbWFnZSBBTkQgYXNzZXRfZm9sZGVyOkpMWi1Qb3J0Zm9saW8vSHV4bGV5IiwibWF4X3Jlc3VsdHMiOjQwfQ==',
    );
  }

  getMyImageInfo() {
    return this.httpClient.get<CloudinaryApiResponse>(
      'https://res.cloudinary.com/dhdioy0wn/search/5666ec92f7c2696dd9f8ba74fd351e16acfacd110c047e5a17a13a5263587649/300/eyJleHByZXNzaW9uIjoicmVzb3VyY2VfdHlwZTppbWFnZSBBTkQgYXNzZXRfZm9sZGVyOkpMWi1Qb3J0Zm9saW8vSmFrZSIsIm1heF9yZXN1bHRzIjo0MH0=',
    );
  }

  getRandomImageInfo() {
    return this.httpClient.get<CloudinaryApiResponse>(
      'https://res.cloudinary.com/dhdioy0wn/search/266921a3bca8d483666b135945f0b47185563b007aadd6d1431027ffc96b51fc/300/eyJleHByZXNzaW9uIjoicmVzb3VyY2VfdHlwZTppbWFnZSBBTkQgYXNzZXRfZm9sZGVyOkpMWi1Qb3J0Zm9saW8vUGhvdG9ncmFwaHkiLCJtYXhfcmVzdWx0cyI6NDB9',
    );
  }

  getHuxleyImageInfoNext() {
    return this.httpClient.get<CloudinaryApiResponse>(
      'https://res.cloudinary.com/dhdioy0wn/search/81ee7fd17ffd0c1e5aa8db7f47c88ec9a519613cab618f1a4ffaa98026dba020/300/eyJleHByZXNzaW9uIjoicmVzb3VyY2VfdHlwZTppbWFnZSBBTkQgYXNzZXRfZm9sZGVyOkpMWi1Qb3J0Zm9saW8vSHV4bGV5IiwibWF4X3Jlc3VsdHMiOjQwfQ==/b1dedb8209018c137c353dd56b2163f02420708bfc533b0fec3ea6fe485acf1c215f3cd8c537aaac8703d074727d6b17',
    );
  }

  getMyImageInfoNext() {
    return this.httpClient.get<CloudinaryApiResponse>(
      'https://res.cloudinary.com/dhdioy0wn/search/5666ec92f7c2696dd9f8ba74fd351e16acfacd110c047e5a17a13a5263587649/300/eyJleHByZXNzaW9uIjoicmVzb3VyY2VfdHlwZTppbWFnZSBBTkQgYXNzZXRfZm9sZGVyOkpMWi1Qb3J0Zm9saW8vSmFrZSIsIm1heF9yZXN1bHRzIjo0MH0=/c965a9061e4b4ba4653adf1671fa1ddbbe808af029bdbff3578c2bb9aede519eaf73f4d9d16d56ca1c8e230dd7431003',
    );
  }

  getRandomImageInfoNext() {
    return this.httpClient.get<CloudinaryApiResponse>(
      'https://res.cloudinary.com/dhdioy0wn/search/266921a3bca8d483666b135945f0b47185563b007aadd6d1431027ffc96b51fc/300/eyJleHByZXNzaW9uIjoicmVzb3VyY2VfdHlwZTppbWFnZSBBTkQgYXNzZXRfZm9sZGVyOkpMWi1Qb3J0Zm9saW8vUGhvdG9ncmFwaHkiLCJtYXhfcmVzdWx0cyI6NDB9/9c43258dc88234010af7a25ad66ea603c492e7c0f4e7388a91577edc043abfc7deaee8e8a130981de163f5f71f77b48f',
    );
  }
}