/* istanbul ignore file */
import { Component, OnInit, inject, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
// import {
//   // Gallery,
//   GalleryConfig,
//   // GalleryItem,
//   // GalleryModule,
//   GalleryRef,
//   ImageItem,
// } from 'ngx-gallery-jz';
import { concatMap, delay, forkJoin, retry } from 'rxjs';
import {
  CloudinaryApiResponse,
  Resource,
} from 'src/app/interfaces/cloudinary-search.interface';
import { ImageService } from 'src/app/services/image/image.service';
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay.component';
import { PhotoGalleryComponent } from '../../../components/photo-gallery/photo-gallery.component';
import { MatPaginator } from '@angular/material/paginator';
import { GalleryItemData } from 'ngx-gallery-jz';

@Component({
  selector: 'jzp-photography-tab',
  templateUrl: './photography-tab.component.html',
  styleUrls: ['./photography-tab.component.scss'],
  imports: [MatCardModule, LoadingOverlayComponent, PhotoGalleryComponent],
})
export class PhotographyTabComponent implements OnInit {
  private imageService = inject(ImageService);

  // private storage = inject(Storage);

  galleryIds = ['MIIIII', 'YUUUUUU'];
  photoGrids: GalleryItemData[][] = [];

  readonly paginator = viewChild(MatPaginator);

  ngOnInit() {
    this.setUpPhotographyImagesCloudinary();

    // const cloudinary = this.imageService.cloudinaryInstance;
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
  //     console.debug('Photography Tab Images Cannot Be Displayed');
  //     throw new Error('Photography Tab  Images Cannot Be Displayed');
  //   }
  // }

  private setUpPhotographyImagesCloudinary() {
    try {
      forkJoin([
        this.imageService.getHuxleyImageInfo(),
        this.imageService.getMyImageInfo(),
        this.imageService.getRandomImageInfo(),
        // this.imageService.getHuxleyImageInfo(
        //   'b1dedb8209018c137c353dd56b2163f02420708bfc533b0fec3ea6fe485acf1c215f3cd8c537aaac8703d074727d6b17',
        // ),
        // this.imageService.getMyImageInfo(
        //   'c965a9061e4b4ba4653adf1671fa1ddbbe808af029bdbff3578c2bb9aede519eaf73f4d9d16d56ca1c8e230dd7431003',
        // ),
        // this.imageService.getRandomImageInfo(
        //   '9c43258dc88234010af7a25ad66ea603c492e7c0f4e7388a91577edc043abfc7deaee8e8a130981de163f5f71f77b48f',
        // ),
      ])
        .pipe(
          delay(2000),
          retry(3),
          concatMap((res) => {
            const x = res.map((origRes) => origRes.next_cursor);
            return forkJoin([
              this.imageService.getHuxleyImageInfo(x[0]),
              this.imageService.getMyImageInfo(x[1]),
              this.imageService.getRandomImageInfo(x[2]),
            ]);
          }),
        )
        .subscribe((imageResults) => {
          console.log(imageResults);

          this.setImageArr(imageResults, []);
        });
    } catch (error) {
      console.debug('Photography Tab Images Cannot Be Displayed');
      throw new Error('Photography Tab  Images Cannot Be Displayed');
    }
  }

  private setImageArr(
    imageResults: CloudinaryApiResponse[],
    arr: GalleryItemData[],
  ): GalleryItemData[] {
    this.zipImageResults([
      imageResults[0].resources,
      imageResults[1].resources,
      imageResults[2].resources,
    ]).forEach((imageResult) => {
      if (imageResult) {
        arr.push({
          src: imageResult.secure_url.replace(
            /v[\d]*/,
            'r_40/w_auto,q_auto,f_auto',
          ),
          thumb: imageResult.secure_url.replace(
            /v[\d]*/,
            'r_40/c_auto,g_auto,q_auto,f_auto',
          ),
        });
      }
    });
    if (arr.length > 0) this.photoGrids.push(arr);
    return arr;
  }

  zipImageResults(arr: Resource[][]) {
    return this.imageService.zipImageResults(arr);
  }
}
