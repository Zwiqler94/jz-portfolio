import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGalleryComponent } from './photo-gallery.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ImageService } from 'src/app/services/image/image.service';

describe('PhotoGalleryComponent', () => {
  let component: PhotoGalleryComponent;
  let fixture: ComponentFixture<PhotoGalleryComponent>;
  let imgService: ImageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGalleryComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ImageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoGalleryComponent);
    component = fixture.componentInstance;
    imgService = TestBed.inject(ImageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getRandomClass', () => {
    const spy = spyOn(component, 'getRandomClass');
    component.getRandomClass();
    expect(spy).toHaveBeenCalled();
  });

  it('should call getRandomClass', () => {
    const spy = spyOn(component, 'getRandomClass');
    component.getRandomClass();
    expect(spy).toHaveBeenCalled();
  });

  it('should get a format cloudinary url', () => {
    imgService = TestBed.inject(ImageService);

    // const spy = spyOn(component, 'formatForCloudinaryProvider')
    // const spyImg = spyOn(
    //   imgService,
    //   'formatForCloudinaryProvider',
    // ).and.returnValue('https://www.x.com/kdkdkd');
    const x = component.formatForCloudinaryProvider(
      'https://www.x.com/r_40/c_thumb,w_100/kdkdkd.jpeg',
    );
    // expect(spy).toHaveBeenCalled();
    expect(x).toBe('/kdkdkd.jpeg');
    expect(
      imgService.formatForCloudinaryProvider(
        'https://www.x.com/r_40/c_thumb,w_100/kdkdkd.jpeg',
      ),
    ).toBe('/kdkdkd.jpeg');
  });
});
