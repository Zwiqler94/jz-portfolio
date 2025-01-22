import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { GalleryItem, GalleryRef, Gallery } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { ImageService } from 'src/app/services/image/image.service';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';

@Component({
    selector: 'app-photo-gallery',
    imports: [
        LightboxModule,
        NgOptimizedImage,
        MatCardModule,
        LoadingOverlayComponent,
        NgClass,
        MatPaginatorModule,
    ],
    templateUrl: './photo-gallery.component.html',
    styleUrl: './photo-gallery.component.scss'
})
export class PhotoGalleryComponent implements OnInit {
  private imageService = inject(ImageService);
  gallery = inject(Gallery);

  @Input() galleryIds: string[] = [];
  @Input() galleryRefs: GalleryRef[] = [];
  @Input() photoGrids: GalleryItem[][] = [];
  displayGrids: GalleryItem[][] = [];
  @Input() galleryType: 'LB' | 'GAL' = 'LB';
  @Input() pageSize: number;
  pageIndex: number;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit() {
    this.displayGrids = this.photoGrids.map((grid) =>
      grid.slice(0, this.pageSize),
    );
  }

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

  onPageChange(event: PageEvent, gridIndex: number) {
    const { startIdx, endIdx } = this.generateGalleryIndices(event);
    this.displayGrids[gridIndex] = this.photoGrids[gridIndex].slice(
      startIdx,
      endIdx,
    );
    this.pageIndex = event.pageIndex;
  }

  generateGalleryIndices(event: PageEvent) {
    let startIdx = 0;
    let endIdx = this.pageSize;
    if (
      event.previousPageIndex &&
      event.previousPageIndex > event.pageIndex &&
      event.pageIndex >= 1
    ) {
      startIdx = event.pageIndex * event.pageSize + 1;
      endIdx = event.pageSize * (event.pageIndex + 1) + 1;
    } else if (
      event.previousPageIndex &&
      event.previousPageIndex > event.pageIndex &&
      event.pageIndex == 0
    ) {
      startIdx = event.pageIndex;
      endIdx = event.pageSize;
    } else if (event.previousPageIndex) {
      startIdx = event.previousPageIndex
        ? event.previousPageIndex * event.pageSize
        : event.pageSize;
      endIdx = event.pageSize * event.pageIndex;
    } else {
      startIdx = this.pageSize + 1;
      endIdx = this.pageSize * 2 + 1;
    }
    return { startIdx, endIdx };
  }
}
