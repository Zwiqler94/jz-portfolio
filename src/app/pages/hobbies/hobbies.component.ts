import { Component, OnInit } from '@angular/core';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { listAll, ListResult, StorageReference } from 'firebase/storage';
import { Observable } from 'rxjs';
// import { cache } from 'src/main';
// import { MediaCacheModel } from 'src/models/cache.model';

@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrls: ['./hobbies.component.scss'],
})
export class HobbiesComponent implements OnInit {
  video: Observable<string | null>;
  japanPics: Observable<string | null>[] = [];
  jlptPics: Observable<string | null>[] = [];
  pics1: Observable<string | null>[] = [];
  pics2: Observable<string | null>[] = [];
  pics3: Observable<string | null>[] = [];
  pics4: Observable<string | null>[] = [];
  pics5: Observable<string | null>[] = [];

  constructor(private storage: Storage) {
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
          console.log(itemRef.name);
          // const internalCacheResult: string | undefined = cache.get(
          //   itemRef.name
          // );
          const localCacheResult =
            localStorage.getItem(itemRef.name);
          if (localCacheResult === null) {
            const url = (await getDownloadURL(
              itemRef
            )) as unknown as Observable<string | null>;
            localStorage.setItem(
              itemRef.name,
              JSON.stringify({ index, url })
            );
            switch (index % 5) {
              case 0:
                this.pics1.push(url);
                break;
              case 1:
                this.pics2.push(url);
                break;
              case 2:
                this.pics3.push(url);
                break;
              case 3:
                this.pics4.push(url);
                break;
              case 4:
                this.pics5.push(url);
                break;
              default:
                this.pics5.push(url);
            }
          } else {
            if (localCacheResult) {
              const cacheResultObj = JSON.parse(localCacheResult);
              switch (cacheResultObj.index % 5) {
                case 0:
                  this.pics1.push(cacheResultObj.url);
                  break;
                case 1:
                  this.pics2.push(cacheResultObj.url);
                  break;
                case 2:
                  this.pics3.push(cacheResultObj.url);
                  break;
                case 3:
                  this.pics4.push(cacheResultObj.url);
                  break;
                case 4:
                  this.pics5.push(cacheResultObj.url);
                  break;
                default:
                  this.pics5.push(cacheResultObj.url);
              }
            }
          }
        }
      );
    } catch (error) {
      console.log('Photography Tab Images Cannot Be Displayed');
      throw new Error('Photography Tab  Images Cannot Be Displayed');
    }
  }

  private async setUpCarouselImages() {
    try {
      const hobbyRef: StorageReference = ref(this.storage, 'hobbies/japan');
      const hobbyImageList: ListResult = await listAll(hobbyRef);
      hobbyImageList.items.forEach((itemRef: StorageReference) => {
        this.japanPics.push(
          getDownloadURL(itemRef) as unknown as Observable<string | null>
        );
      });
    } catch (error) {
      console.log('Carousel Images Cannot Be Displayed');
      throw new Error('Carousel Images Cannot Be Displayed');
    }
  }

  private async setUpJLPTImages() {
    try {
      const hobbyRef: StorageReference = ref(this.storage, 'hobbies/jlpt');
      const hobbyImageList: ListResult = await listAll(hobbyRef);
      hobbyImageList.items.forEach( async (itemRef: StorageReference) => {
        this.jlptPics.push(
          await getDownloadURL(itemRef) as unknown as Observable<string | null>
        );
      });
    } catch (error) {
      console.log('JLPT Images Cannot Be Displayed');
      throw new Error('JLPT Images Cannot Be Displayed');
    }
  }

  private async setupVideos() {
    const fitnessStorageRef: StorageReference = ref(this.storage, 'fitness');
    const fitnessVideoList: ListResult = await listAll(fitnessStorageRef);
    fitnessVideoList.items
      .filter((video) => video.name === 'IMG_7987.mp4')
      .forEach((refItem: StorageReference) => {
        this.video = getDownloadURL(refItem) as unknown as Observable<
          string | null
        >;
      });
  }
}
