import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Resource } from 'src/app/interfaces/cloudinary-search.interface';

const API_CASES = [
  {
    name: 'getHuxleyImageInfo',
    base: 'https://res.cloudinary.com/dhdioy0wn/search/81ee7fd17ffd0c1e5aa8db7f47c88ec9a519613cab618f1a4ffaa98026dba020/300/eyJleHByZXNzaW9uIjoicmVzb3VyY2VfdHlwZTppbWFnZSBBTkQgYXNzZXRfZm9sZGVyOkpMWi1Qb3J0Zm9saW8vSHV4bGV5IiwibWF4X3Jlc3VsdHMiOjQwfQ==',
  },
  {
    name: 'getMyImageInfo',
    base: 'https://res.cloudinary.com/dhdioy0wn/search/5666ec92f7c2696dd9f8ba74fd351e16acfacd110c047e5a17a13a5263587649/300/eyJleHByZXNzaW9uIjoicmVzb3VyY2VfdHlwZTppbWFnZSBBTkQgYXNzZXRfZm9sZGVyOkpMWi1Qb3J0Zm9saW8vSmFrZSIsIm1heF9yZXN1bHRzIjo0MH0=',
  },
  {
    name: 'getRandomImageInfo',
    base: 'https://res.cloudinary.com/dhdioy0wn/search/266921a3bca8d483666b135945f0b47185563b007aadd6d1431027ffc96b51fc/300/eyJleHByZXNzaW9uIjoicmVzb3VyY2VfdHlwZTppbWFnZSBBTkQgYXNzZXRfZm9sZGVyOkpMWi1Qb3J0Zm9saW8vUGhvdG9ncmFwaHkiLCJtYXhfcmVzdWx0cyI6NDB9',
  },
  {
    name: 'getJapanImageInfo',
    base: 'https://res.cloudinary.com/dhdioy0wn/search/7015ba7c91fa281e6c31282672d041c8558bd79dea54828efa5fd6d9fc230e51/300/eyJleHByZXNzaW9uIjoicmVzb3VyY2VfdHlwZTppbWFnZSBBTkQgYXNzZXRfZm9sZGVyOkpMWi1Qb3J0Zm9saW8vSmFwYW4iLCJtYXhfcmVzdWx0cyI6MjAwfQ==',
  },
] as const;

describe('ImageService', () => {
  let service: ImageService;
  let httpMock: HttpTestingController;
  const cursorKey = 'next-cursor';
  type EndpointName = (typeof API_CASES)[number]['name'];

  const invokeEndpoint = (methodName: EndpointName, cursor?: string) =>
    (service[methodName] as (cursorKey?: string) => any)(cursor);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ImageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an array of GalleryItems', () => {
    const x: Resource[][] = [
      [{ filename: 'A' } as Resource, { filename: 'Z' } as Resource],
      [{ filename: 'B' } as Resource, { filename: 'X' } as Resource],
      [{ filename: 'C' } as Resource, { filename: 'Y' } as Resource],
    ];
    expect(service.zipImageResults(x)).toEqual([
      { filename: 'A' } as Resource,
      { filename: 'B' } as Resource,
      { filename: 'C' } as Resource,
      { filename: 'Z' } as Resource,
      { filename: 'X' } as Resource,
      { filename: 'Y' } as Resource,
    ]);
  });

  it('formatForCloudinaryProvider trims Cloudinary host prefix', () => {
    const result = service.formatForCloudinaryProvider(
      'https://res.cloudinary.com/dhdioy0wn/image/upload/v1/sample.jpg',
    );
    expect(result).toBe('/v1/sample.jpg');
  });

  it('formatForCloudinaryProvider returns the last segment for arbitrary URLs', () => {
    const result = service.formatForCloudinaryProvider(
      'https://example.com/images/gallery/photo.png',
    );
    expect(result).toBe('/photo.png');
  });

  it('formatForCloudinaryProvider handles relative paths', () => {
    const result = service.formatForCloudinaryProvider(
      'images/gallery/photo.png',
    );
    expect(result).toBe('/photo.png');
  });

  it('formatForCloudinaryProvider returns a slash when the path is empty', () => {
    const result = service.formatForCloudinaryProvider('https://example.com/');
    expect(result).toBe('/');
  });

  it('formatForCloudinaryProvider keeps empty inputs intact', () => {
    expect(service.formatForCloudinaryProvider('')).toBe('');
  });

  API_CASES.forEach(({ name, base }) => {
    it(`${name} uses the base Cloudinary query when no cursor is provided`, () => {
      invokeEndpoint(name).subscribe(() => {
        /* empty */
      });
      const req = httpMock.expectOne(base);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it(`${name} appends the cursor when provided`, () => {
      invokeEndpoint(name, cursorKey).subscribe(() => {
        /* empty */
      });
      const req = httpMock.expectOne(`${base}/${cursorKey}`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });
});
