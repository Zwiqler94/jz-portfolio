import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GalleryItem, GalleryRef, Gallery, ImageItem } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { forkJoin, delay, retry } from 'rxjs';
import {
  CloudinaryApiResponse,
  Resource,
} from 'src/app/interfaces/cloudinary-search.interface';
import { ImageService } from 'src/app/services/image/image.service';
import { ServiceWorkerService } from 'src/app/services/service-worker/service-worker.service';
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay.component';
import { PhotoGalleryComponent } from '../../../components/photo-gallery/photo-gallery.component';

@Component({
    selector: 'app-japanese-tab',
    templateUrl: './japanese-tab.component.html',
    styleUrls: ['./japanese-tab.component.scss'],
    imports: [
        LightboxModule,
        MatCardModule,
        LoadingOverlayComponent,
        PhotoGalleryComponent,
    ]
})
export class JapaneseTabComponent implements OnInit {
  private sw = inject(ServiceWorkerService);
  private imageService = inject(ImageService);
  gallery = inject(Gallery);

  galleryIds = ['MIIIII'];
  galleryRefs: GalleryRef[] = [];
  photoGrids: GalleryItem[][] = [];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit() {
    this.setUpPhotographyImagesCloudinary();
  }

  private setUpPhotographyImagesCloudinary() {
    try {
      forkJoin([this.imageService.getJapanImageInfo()])
        .pipe(delay(5000), retry(3))
        .subscribe((imageResults) => {
          // this.setImageArr(imageResults.slice(0, 3), []);
          const galleryRef1 = this.gallery.ref(this.galleryIds[0]);

          galleryRef1.load(this.setImageArr(imageResults.slice(0, 3), []));

          this.galleryRefs = [galleryRef1];
        });
    } catch (error) {
      console.debug('Japanese Tab Images Cannot Be Displayed');
      throw new Error('Japanese Tab  Images Cannot Be Displayed');
    }
  }

  private setImageArr(
    imageResults: CloudinaryApiResponse[],
    arr: GalleryItem[],
  ): GalleryItem[] {
    const resources = imageResults.map((result) => result.resources);
    this.zipImageResults([...resources]).forEach((imageResult) => {
      if (imageResult) {
        arr.push(
          new ImageItem({
            src: imageResult.secure_url.replace(/v[\d]*/, 'r_40'),
            thumb: imageResult.secure_url.replace(
              /v[\d]*/,
              'r_40/c_thumb,w_100',
            ),
          }),
        );
      }
    });
    if (arr.length > 0) this.photoGrids.push(arr);
    return arr;
  }

  zipImageResults(arr: Resource[][]) {
    return this.imageService.zipImageResults(arr);
  }
}
