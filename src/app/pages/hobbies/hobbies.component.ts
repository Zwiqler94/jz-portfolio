import { Component, inject } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
import { TabGroupComponent } from 'src/app/components/tab-group/tab-group.component';
import { JapaneseTabComponent } from 'src/app/pages/hobbies/japanese-tab/japanese-tab.component';
import { PhotographyTabComponent } from 'src/app/pages/hobbies/photography-tab/photography-tab.component';
import { ServiceWorkerService } from 'src/app/services/service-worker/service-worker.service';

@Component({
  selector: 'jzp-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrls: ['./hobbies.component.scss'],
  imports: [TabGroupComponent],
})
export class HobbiesComponent {
  private storage = inject(Storage);
  private sw = inject(ServiceWorkerService);
  private router = inject(Router);

  private _tabComponentList: TabNavModel[] = [
    {
      component: PhotographyTabComponent,
      title: 'Photography',
      link: 'photos',
    },
    {
      component: JapaneseTabComponent,
      title: 'Japanese',
      link: 'japanese',
    },
    // { component: FitnessTabComponent, title: 'Fitness', link: 'fitness' },
  ];

  constructor() {
    const currentPagePath = location.pathname.split('/').pop();
    const result = this.tabComponentList.filter(
      (tabItem) => tabItem.link === currentPagePath,
    );
    if (result.length <= 0)
      this.router.navigateByUrl('/hobbies/photos', {
        skipLocationChange: true,
      });
  }

  // public get video(): string {
  //   return this.sw.video;
  // }

  // public get japanPics(): string[] {
  //   return this.sw.japanPics;
  // }

  // public get pics1(): string[] {
  //   return this.sw.pics1;
  // }

  // public get pics2(): string[] {
  //   return this.sw.pics2;
  // }

  // public get pics3(): string[] {
  //   return this.sw.pics3;
  // }

  // public get pics4(): string[] {
  //   return this.sw.pics4;
  // }

  // public get pics5(): string[] {
  //   return this.sw.pics5;
  // }

  public get tabComponentList(): TabNavModel[] {
    return this._tabComponentList;
  }
  public set tabComponentList(value: TabNavModel[]) {
    this._tabComponentList = value;
  }

  // private async setUpCarouselImages() {
  //   try {
  //     const hobbyRef: StorageReference = ref(this.storage, 'hobbies/japan');
  //     const hobbyImageList: ListResult = await listAll(hobbyRef);
  //     hobbyImageList.items.forEach(async (itemRef: StorageReference) => {
  //       this.sw.japanPics.push(await getDownloadURL(itemRef));
  //     });
  //   } catch (error) {
  //     console.debug('Carousel Images Cannot Be Displayed');
  //     throw new Error('Carousel Images Cannot Be Displayed');
  //   }
  // }

  // private async setupVideos() {
  //   const fitnessStorageRef: StorageReference = ref(this.storage, 'fitness');
  //   const fitnessVideoList: ListResult = await listAll(fitnessStorageRef);
  //   fitnessVideoList.items
  //     .filter((video) => video.name === 'IMG_7987.mp4')
  //     .forEach(async (refItem: StorageReference) => {
  //       this.sw.video = await getDownloadURL(refItem);
  //     });
  // }
}
