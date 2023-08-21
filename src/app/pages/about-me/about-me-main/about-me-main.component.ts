import { Component, Input } from '@angular/core';
import { Tabs } from 'src/app/interfaces/tabs.model';

@Component({
  selector: 'app-about-me-main',
  templateUrl: './about-me-main.component.html',
  styleUrls: ['./about-me-main.component.scss'],
})
export class AboutMeMainComponent extends Tabs {
  @Input() public tabTitle: string;
  _profileImage = './assets/about-me/me.jpeg';
}
