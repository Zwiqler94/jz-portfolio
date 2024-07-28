import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Resource } from 'src/app/interfaces/cloudinary-search.interface';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ImageService);
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

  it('should get a format cloudinary url', () => {
    // const spy = spyOn(component, 'formatForCloudinaryProvider');
    const spyImg = spyOn(
      service,
      'formatForCloudinaryProvider',
    ).and.returnValue('/kdkdkd.jpeg');
    const x = service.formatForCloudinaryProvider(
      'https://www.x.com/r_40/c_thumb,w_100/kdkdkd.jpeg',
    );
    console.debug({ x });
    expect(x).toBe('/kdkdkd.jpeg');
    expect(spyImg).toHaveBeenCalled();
  });
});
