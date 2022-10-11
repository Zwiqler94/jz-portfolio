import { Component, NgZone, OnInit } from '@angular/core';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { listAll, ListResult, StorageReference } from 'firebase/storage';
import { Observable } from 'rxjs';


const cache = new NodeCache()

@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrls: ['./hobbies.component.scss'],
})
export class HobbiesComponent implements OnInit {
  video: Observable<string | null>;
  japanPics: Observable<string | null>[] = [];
  pics1: Observable<string | null>[] = [];
  pics2: Observable<string | null>[] = [];
  pics3: Observable<string | null>[] = [];
  pics4: Observable<string | null>[] = [];
  pics5: Observable<string | null>[] = [];

  constructor(private storage: Storage) {
    this.setupVideos();
    this.setUpCarouselImages();
    this.setUpPhotographyImages();
  }

  ngOnInit(): void {}

  private async setUpPhotographyImages() {
    try {
      const hobbyRef: StorageReference = ref(this.storage, 'hobbies/photography');
      const hobbyImageList: ListResult = await listAll(hobbyRef);
      console.log(hobbyImageList)
      hobbyImageList.items
        .forEach((itemRef: StorageReference, index: number) => {
          switch (index % 5) {
            case 0:
              this.pics1.push(
                getDownloadURL(itemRef) as unknown as Observable<string | null>
              );
              break;
            case 1:
              this.pics2.push(
                getDownloadURL(itemRef) as unknown as Observable<string | null>
              );
              break;
            case 2:
              this.pics3.push(
                getDownloadURL(itemRef) as unknown as Observable<string | null>
              );
              break;
            case 3:
              this.pics4.push(
                getDownloadURL(itemRef) as unknown as Observable<string | null>
              );
              break;
            case 4:
              this.pics5.push(
                getDownloadURL(itemRef) as unknown as Observable<string | null>
              );
              break;
            default:
              this.pics5.push(
                getDownloadURL(itemRef) as unknown as Observable<string | null>
              );
          }
        });
    } catch (error) {
      console.log('Photography Tab Images Cannot Be Displayed');
      throw new Error('Photography Tab  Images Cannot Be Displayed');
    }
  }

  private async setUpCarouselImages() {
    try {
      const hobbyRef: StorageReference = ref(this.storage, 'hobbies');
      const hobbyImageList: ListResult = await listAll(hobbyRef);
      hobbyImageList.items
        .filter((folder) => folder.name === 'japan')
        .forEach((itemRef: StorageReference) => {
          this.japanPics.push(
            getDownloadURL(itemRef) as unknown as Observable<string | null>
          );
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
      .forEach((refItem: StorageReference) => {
        this.video = getDownloadURL(refItem) as unknown as Observable<
          string | null
        >;
      });
  }
}
