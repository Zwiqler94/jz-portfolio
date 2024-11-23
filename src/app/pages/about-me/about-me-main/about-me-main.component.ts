import { Component, input } from '@angular/core';
import { MatCard, MatCardImage, MatCardContent } from '@angular/material/card';
import { TabComponent } from 'src/app/components/tab/tab.component';

@Component({
  selector: 'app-about-me-main',
  templateUrl: './about-me-main.component.html',
  styleUrls: ['./about-me-main.component.scss'],
  imports: [MatCard, MatCardImage, MatCardContent],
})
export class AboutMeMainComponent extends TabComponent {
  _profileImage = './assets/about-me/me.avif';
  _sideImageA: string = './assets/about-me/side-image-18.avif';
  _sideImageB: string = './assets/about-me/side-image-2.avif';
  _sideImageC: string = './assets/about-me/side-image-3.avif';
  _sideImageD: string = './assets/about-me/side-image-4.avif';
  _sideImageE: string = './assets/about-me/side-image-5.avif';
  _sideImageF: string = './assets/about-me/side-image-6.avif';
  _sideImageG: string = './assets/about-me/side-image-11.avif';
  _sideImageH: string = './assets/about-me/side-image-14.avif';
  _sideImageI: string = './assets/about-me/side-image-16.avif';
  _sideImageJ: string = './assets/about-me/side-image-19.avif';
}
