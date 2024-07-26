import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GalleryItem, GalleryRef, Gallery } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { ImageService } from 'src/app/services/image/image.service';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [
    LightboxModule,
    NgOptimizedImage,
    MatCardModule,
    LoadingOverlayComponent,
    NgClass,
  ],
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.scss',
})
export class PhotoGalleryComponent {
  @Input() galleryIds: string[] = [];
  @Input() galleryRefs: GalleryRef[] = [];
  @Input() photoGrids: GalleryItem[][] = [];

  constructor(
    private imageService: ImageService,
    public gallery: Gallery,
  ) {}

  formatForCloudinaryProvider(imageUrl: string) {
    return this.imageService.formatForCloudinaryProvider(imageUrl);
  }

  getRandomClass() {
    const classArray = [
      'primary-1',
      'primary-2',
      'primary-3',
      'primary-4',
      'primary-5',
      'primary-6',
      'primary-7',
      'primary-8',
      'primary-9',
      'secondary-1',
      'secondary-2',
      'secondary-3',
      'secondary-4',
      'secondary-5',
      'secondary-6',
      'secondary-7',
      'secondary-8',
      'secondary-9',
      'complementary-1',
      'complementary-2',
      'complementary-3',
      'complementary-4',
      'complementary-5',
      'complementary-6',
      'complementary-7',
      'complementary-8',
    ];
    return classArray[
      Math.round(Math.random() * classArray.length) % classArray.length
    ];
  }
}
