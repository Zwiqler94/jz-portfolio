import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  Storage,
  getDownloadURL,
  listAll,
  ListResult,
  ref,
  StorageReference,
} from '@angular/fire/storage';
import { MatCard, MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { zip } from 'lodash-es';
import { Gallery, GalleryItem, GalleryRef, ImageItem } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { delay, forkJoin, retry } from 'rxjs';
import {
  CloudinaryApiResponse,
  Resource,
} from 'src/app/interfaces/cloudinary-search.interface';
import { ImageService } from 'src/app/services/image/image.service';
import { ServiceWorkerService } from 'src/app/services/service-worker/service-worker.service';
// import Jimp from 'jimp';

@Component({
  selector: 'app-photography-tab',
  templateUrl: './photography-tab.component.html',
  styleUrls: ['./photography-tab.component.scss'],
  standalone: true,
  imports: [LightboxModule, AsyncPipe, NgOptimizedImage, MatCardModule],
})
export class PhotographyTabComponent implements OnInit {
  private storage = inject(Storage);

  pics: GalleryItem[] = [];
  pics2: GalleryItem[] = [];
  galleryIds = ['MIIIII', 'YUUUUUU'];
  galleryRefs: GalleryRef[] = [];
  constructor(
    private sw: ServiceWorkerService,
    private router: Router,
    private imageService: ImageService,
    public gallery: Gallery,
  ) {}

  async ngOnInit() {
    await this.setUpPhotographyImagesCloudinary();
  }

  // private async setUpPhotographyImages() {
  //   try {
  //     const hobbyRef: StorageReference = ref(
  //       this.storage,
  //       'hobbies/photography',
  //     );
  //     const hobbyImageList: ListResult = await listAll(hobbyRef);
  //     hobbyImageList.items.forEach(
  //       async (itemRef: StorageReference, index: number) => {
  //         const url = await getDownloadURL(itemRef);

  //         // (Jimp.read(url).then(async (image) => {
  //         // const c =  await (image.resize(50, 50).writeAsync(itemRef.name));
  //         this.pics.push(
  //           new ImageItem({
  //             src: url,
  //             thumb: 'assets/icons/favicon-96x96.png',
  //           }),
  //         );
  //         // }))

  //         // switch (index % 5) {
  //         //   case 0:
  //         //     this.sw.pics1.push(url);
  //         //     break;
  //         //   case 1:
  //         //     this.sw.pics2.push(url);
  //         //     break;
  //         //   case 2:
  //         //     this.sw.pics3.push(url);
  //         //     break;
  //         //   case 3:
  //         //     this.sw.pics4.push(url);
  //         //     break;
  //         //   case 4:
  //         //     this.sw.pics5.push(url);
  //         //     break;
  //         //   default:
  //         //     this.sw.pics5.push(url);
  //         // }
  //         // } else {
  //         //   if (localCacheResult) {
  //         //     const cacheResultObj = JSON.parse(localCacheResult);
  //         //     switch (cacheResultObj.index % 5) {
  //         //       case 0:
  //         //         this.pics1.push(cacheResultObj.url);
  //         //         break;
  //         //       case 1:
  //         //         this.pics2.push(cacheResultObj.url);
  //         //         break;
  //         //       case 2:
  //         //         this.pics3.push(cacheResultObj.url);
  //         //         break;
  //         //       case 3:
  //         //         this.pics4.push(cacheResultObj.url);
  //         //         break;
  //         //       case 4:
  //         //         this.pics5.push(cacheResultObj.url);
  //         //         break;
  //         //       default:
  //         //         this.pics5.push(cacheResultObj.url);
  //         //     }
  //         //   }
  //         // }
  //       },
  //     );
  //     const galleryRef = this.gallery.ref(this.galleryId);
  //     galleryRef.load(this.pics);
  //   } catch (error) {
  //     console.log('Photography Tab Images Cannot Be Displayed');
  //     throw new Error('Photography Tab  Images Cannot Be Displayed');
  //   }
  // }

  private setUpPhotographyImagesCloudinary() {
    try {
      forkJoin([
        this.imageService.getHuxleyImageInfo(),
        this.imageService.getMyImageInfo(),
        this.imageService.getRandomImageInfo(),
        this.imageService.getHuxleyImageInfoNext(),
        this.imageService.getMyImageInfoNext(),
        this.imageService.getRandomImageInfoNext(),
      ])
        .pipe(delay(5000), retry(3))
        .subscribe((imageResults) => {
          this.setImageArr(imageResults.slice(0, 3), this.pics);
          this.setImageArr(imageResults.slice(3), this.pics2);
        });

      const galleryRef1 = this.gallery.ref(this.galleryIds[0]);
      const galleryRef2 = this.gallery.ref(this.galleryIds[1]);
      galleryRef1.load(this.pics);
      galleryRef2.load(this.pics2);
      this.galleryRefs = [galleryRef1,galleryRef2]
    } catch (error) {
      console.log('Photography Tab Images Cannot Be Displayed');
      throw new Error('Photography Tab  Images Cannot Be Displayed');
    }
  }

  private setImageArr(
    imageResults: CloudinaryApiResponse[],
    arr: GalleryItem[],
  ) {
    this.removeUndefinedArrayValuesAndZip([
      imageResults[0].resources,
      imageResults[1].resources,
      imageResults[2].resources,
    ]).forEach((imageResult) => {
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
  }

  formartForCloudinaryProvider(imageUrl: string) {
    console.log({
      theURI: imageUrl.replace(
        /.*\/r_40\/c_thumb,w_100(?=.*(svg|cur|jp(e*)g|png|apng|webp|avif|gif|otf|ttf|woff|woff2|mp4)+)/,
        '',
      ),
    });
    return imageUrl.replace(
      /.*\/r_40\/c_thumb,w_100(?=.*(svg|cur|jp(e*)g|png|apng|webp|avif|gif|otf|ttf|woff|woff2|mp4)+)/,
      '',
    );
  }

  removeUndefinedArrayValuesAndZip(arr: Resource[][]) {
    console.log({ zippedFlatten: zip(...arr).flat(2), zipped: zip(...arr) });
    return zip(...arr).flat(2);
  }
}
