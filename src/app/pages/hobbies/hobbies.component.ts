/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Component, NgZone, OnInit } from '@angular/core';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { listAll, ListResult, StorageReference } from 'firebase/storage';
import { Observable } from 'rxjs';
import { ServiceWorkerService } from 'src/app/services/service-worker/service-worker.service';
// import { cache } from 'src/main';
// import { MediaCacheModel } from 'src/models/cache.model';

@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrls: ['./hobbies.component.scss'],
})
export class HobbiesComponent implements OnInit {
  constructor(private storage: Storage, private sw: ServiceWorkerService) {
    this.setupVideos();
    this.setUpCarouselImages();
    this.setUpPhotographyImages();
    // cache.on('set', () => {
    //   console.log('Miss: media stored in cache');
    // });
    // cache.on('get', () => {
    //   console.log('Hit: media retrieved in cache');
    // });
  }

  ngOnInit(): void {}

  private async setUpPhotographyImages() {
    try {
      const hobbyRef: StorageReference = ref(
        this.storage,
        'hobbies/photography'
      );
      const hobbyImageList: ListResult = await listAll(hobbyRef);
      hobbyImageList.items.forEach(
        async (itemRef: StorageReference, index: number) => {
          // console.log(itemRef);
          // const internalCacheResult: string | undefined = cache.get(
          //   itemRef.name
          // );
          // const localCacheResult = localStorage.getItem(itemRef.name);
          // if (localCacheResult === null) {
          const url = await getDownloadURL(itemRef);
          console.log({ url });
          // localStorage.setItem(itemRef.name, JSON.stringify({ index, url }));
          switch (index % 5) {
            case 0:
              this.sw.pics1.push(url);
              break;
            case 1:
              this.sw.pics2.push(url);
              break;
            case 2:
              this.sw.pics3.push(url);
              break;
            case 3:
              this.sw.pics4.push(url);
              break;
            case 4:
              this.sw.pics5.push(url);
              break;
            default:
              this.sw.pics5.push(url);
          }
          // } else {
          //   if (localCacheResult) {
          //     const cacheResultObj = JSON.parse(localCacheResult);
          //     switch (cacheResultObj.index % 5) {
          //       case 0:
          //         this.pics1.push(cacheResultObj.url);
          //         break;
          //       case 1:
          //         this.pics2.push(cacheResultObj.url);
          //         break;
          //       case 2:
          //         this.pics3.push(cacheResultObj.url);
          //         break;
          //       case 3:
          //         this.pics4.push(cacheResultObj.url);
          //         break;
          //       case 4:
          //         this.pics5.push(cacheResultObj.url);
          //         break;
          //       default:
          //         this.pics5.push(cacheResultObj.url);
          //     }
          //   }
          // }
        }
      );
    } catch (error) {
      console.log('Photography Tab Images Cannot Be Displayed');
      throw new Error('Photography Tab  Images Cannot Be Displayed');
    }
  }

  public get video(): string {
    return this.sw.video;
  }
 
  public get japanPics(): string[] {
    return this.sw.japanPics;
  }

  public get pics1(): string[] {
    return this.sw.pics1;
  }

  public get pics2(): string[] {
    return this.sw.pics2;
  }

  public get pics3(): string[] {
    return this.sw.pics3;
  }

  public get pics4(): string[] {
    return this.sw.pics4;
  }

  public get pics5(): string[] {
    return this.sw.pics5;
  }
 

  private async setUpCarouselImages() {
    try {
      const hobbyRef: StorageReference = ref(this.storage, 'hobbies/japan');
      const hobbyImageList: ListResult = await listAll(hobbyRef);
      hobbyImageList.items.forEach(async (itemRef: StorageReference) => {
        this.sw.japanPics.push(await getDownloadURL(itemRef));
      });
    } catch (error) {
      console.log('Carousel Images Cannot Be Displayed');
      throw new Error('Carousel Images Cannot Be Displayed');
    }
  }

  private async setupVideos() {
    const fitnessStorageRef: StorageReference = ref(this.storage, 'fitness');
    const fitnessVideoList: ListResult = await listAll(fitnessStorageRef);
    fitnessVideoList.items
      .filter((video) => video.name === 'IMG_7987.mp4')
      .forEach(async (refItem: StorageReference) => {
        this.sw.video = await getDownloadURL(refItem);
      });
  }
}
