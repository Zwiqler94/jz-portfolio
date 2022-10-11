import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ListResult, Reference } from '@angular/fire/compat/storage/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrls: ['./hobbies.component.scss'],
})
export class HobbiesComponent implements OnInit {
  japanSlides: any = [];
  // = [
  //   { src: '../../../assets/hobbies/japan/Japan00001.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00002.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00003.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00004.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00005.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00006.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00007.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00008.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00009.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00010.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00011.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00012.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00013.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00014.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00015.jpeg' },
  //   { src: '../../../assets/hobbies/japan/Japan00016.jpeg' }
  // ];

  photographySlides1 = [
    { src: '../../../assets/hobbies/photography/photo_set_01_5.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_8.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_9.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_10.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_11.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_12.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_13.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_01_6.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_01_8.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_01_9.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_01_10.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_01_11.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_01_12.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_01_13.jpeg' },
  ];

  photographySlides2 = [
    { src: '../../../assets/hobbies/photography/photo_set_02_1.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_2.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_3.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_01_3.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_01_4.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_03_5.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_03_6.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_14.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_15.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_16.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_4.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_8.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_9.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_03_3.jpeg' },
  ];

  photographySlides3 = [
    { src: '../../../assets/hobbies/photography/photo_set_03_1.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_03_2.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_4.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_5.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_01_1.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_01_2.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_03_10.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_03_11.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_03_12.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_5.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_6.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_7.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_7.jpeg' },
  ];

  photographySlides4 = [
    { src: '../../../assets/hobbies/photography/photo_set_04_1.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_2.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_3.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_03_8.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_03_9.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_10.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_11.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_12.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_13.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_04_14.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_02_6.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_03_4.jpeg' },
    { src: '../../../assets/hobbies/photography/photo_set_03_7.jpeg' },
  ];

  starbucksDrinks = [
    // { drinkName: 'Ice Caffe Mocha', src: 'https://shorturl.at/OQU36' },
    // { drinkName: 'Caffe Mocha', src: 'https://shorturl.at/tBEU0' },
    // { drinkName: 'Iced Caramel Machiatto', src: 'https://shorturl.at/hHOUZ' }
    // {drinkName: , src:},
    // {drinkName: , src:},
    // {drinkName: , src:},
    // {drinkName: , src:},
    // {drinkName: , src:},
    // {drinkName: , src:},
  ];

  video: Observable<string | null>;
  japanPics: Observable<string | null>[] = [];
  pics1: Observable<string | null>[] = [];
  pics2: Observable<string | null>[] = [];
  pics3: Observable<string | null>[] = [];
  pics4: Observable<string | null>[] = [];
  pics5: Observable<string | null>[] = [];

  constructor(private storage: AngularFireStorage) {
    const fitnessStorageRef = this.storage.ref('fitness').child('IMG_7987.mp4');
    this.video = fitnessStorageRef.getDownloadURL();

    this.storage.upload('fitness/', this.video, {
      cacheControl: 'public,max-age=31536000',
    });

    this.storage
      .ref('hobbies')
      .child('japan')
      .listAll()
      .subscribe((x: any) => {
        x.items.forEach((itemRef: any) => {
          this.japanPics.push(itemRef.getDownloadURL());
        });
      });

    this.storage
      .ref('hobbies')
      .child('photography')
      .listAll()
      .subscribe((x: ListResult) => {
        x.items.forEach((itemRef: Reference, index: number) => {
          switch (index % 5) {
            case 0:
              this.pics1.push(
                itemRef.getDownloadURL() as unknown as Observable<string | null>
              );
              break;
            case 1:
              this.pics2.push(
                itemRef.getDownloadURL() as unknown as Observable<string | null>
              );
              break;
            case 2:
              this.pics3.push(
                itemRef.getDownloadURL() as unknown as Observable<string | null>
              );
              break;
            case 3:
              this.pics4.push(
                itemRef.getDownloadURL() as unknown as Observable<string | null>
              );
              break;
            case 4:
              this.pics5.push(
                itemRef.getDownloadURL() as unknown as Observable<string | null>
              );
              break;
            default:
              this.pics5.push(
                itemRef.getDownloadURL() as unknown as Observable<string | null>
              );
          }
        });
      });
  }

  ngOnInit(): void {}
}
