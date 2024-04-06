import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate,
} from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Tabs } from 'src/app/interfaces/tabs.model';

@Component({
  selector: 'app-about-me-main',
  templateUrl: './about-me-main.component.html',
  styleUrls: ['./about-me-main.component.scss'],
  animations: [
    trigger('anis', [
      // state('start', style({ opacity: 1, transform: 'none' })),
      // transition(':enter', []),
      transition('* <=> *, void <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-100px)' }),
            stagger('90ms', [
              animate(
                '0.5s 10ms ease-in',
                style({ opacity: 1, transform: 'none' })
              ),
            ]),
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            style({ opacity: 1, transform: 'none' }),
            stagger('150ms', [
              animate(
                '0.5s 10ms ease-out',
                style({ opacity: 0, transform: 'translateY(-100px)' })
              ),
            ]),
          ],
          {
            optional: true,
          }
        ),
      ]),
      // transition(':leave', [
      //   style({ opacity: 0, transform: 'translateY(-100)' }),
      //   animate('5s 100ms ease-out'),
      // ]),
    ]),
  ],
})
export class AboutMeMainComponent extends Tabs {
  @Input() public tabTitle: string;
  _profileImage = './assets/about-me/me.jpeg';
  _sideImageA: string = './assets/about-me/side-image-18.jpeg';
  _sideImageB: string = './assets/about-me/side-image-2.png';
  _sideImageC: string = './assets/about-me/side-image-3.png';
  _sideImageD: string = './assets/about-me/side-image-4.jpeg';
  _sideImageE: string = './assets/about-me/side-image-5.jpeg';
  _sideImageF: string = './assets/about-me/side-image-6.jpeg';
  _sideImageG: string = './assets/about-me/side-image-11.jpeg';
  _sideImageH: string = './assets/about-me/side-image-14.jpeg';
  _sideImageI: string = './assets/about-me/side-image-16.jpeg';
  _sideImageJ: string = './assets/about-me/side-image-19.jpeg';
}
