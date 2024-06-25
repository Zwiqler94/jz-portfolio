import { Component, Input } from '@angular/core';
import { Tabs } from 'src/app/interfaces/tabs.model';
import { MatCard, MatCardImage, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-about-me-main',
  templateUrl: './about-me-main.component.html',
  styleUrls: ['./about-me-main.component.scss'],
  standalone: true,
  imports: [MatCard, MatCardImage, MatCardContent],
})
export class AboutMeMainComponent extends Tabs {
  @Input() public tabTitle: string;
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
