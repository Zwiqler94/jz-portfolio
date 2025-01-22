import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Tabs } from 'src/app/interfaces/tabs.model';
import { MatCard, MatCardImage, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-about-me-main',
    templateUrl: './about-me-main.component.html',
    styleUrls: ['./about-me-main.component.scss'],
    animations: [
        trigger('anis', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(-100px)' }),
                animate('0.5s 100ms ease-in', style({ opacity: 1, transform: 'none' })),
            ]),
            transition(':leave', [
                animate('0.5s 100ms ease-out', style({ opacity: 0, transform: 'translateY(-100px)' })),
            ]),
        ]),
        trigger('sideAnisLeft', [
            // transition(':enter', []),
            transition(':enter', [
                query('.side-image', [
                    style({ opacity: 0, transform: 'translateX(-300px)' }),
                    stagger('90ms', [
                        animate('0.5s 200ms ease-in', style({ opacity: 1, transform: 'none' })),
                    ]),
                ]),
                // query(':leave', [
                //   style({ opacity: 1, transform: 'none' }),
                //   stagger('150ms', [
                //     animate(
                //       '0.5s 100ms ease-out',
                //       style({ opacity: 0, transform: 'translateY(-100px)' })
                //     ),
                //   ]),
                // ]),
            ]),
            transition(':leave', [
                query('.side-image', [
                    stagger('20ms', [
                        animate('0.5s 100ms ease-out', style({ opacity: 0, transform: 'translateX(-300px)' })),
                    ]),
                ]),
                // transition(':leave', [
                //   animate(
                //     '0.5s 100ms ease-out',
                //     style({ opacity: 0, transform: 'translateY(-100px)' })
                //   ),
                // ]),
            ]),
        ]),
        trigger('sideAnisRight', [
            // transition(':enter', []),
            transition(':enter', [
                query('.side-image', [
                    style({ opacity: 0, transform: 'translateX(300px)' }),
                    stagger('90ms', [
                        animate('0.5s 200ms ease-in', style({ opacity: 1, transform: 'none' })),
                    ]),
                ]),
                // query(':leave', [
                //   style({ opacity: 1, transform: 'none' }),
                //   stagger('150ms', [
                //     animate(
                //       '0.5s 100ms ease-out',
                //       style({ opacity: 0, transform: 'translateY(-100px)' })
                //     ),
                //   ]),
                // ]),
            ]),
            transition('main => void', [
                query('.side-image', [
                    stagger('20ms', [
                        animate('0.5s 100ms ease-out', style({ opacity: 0, transform: 'translateX(300px)' })),
                    ]),
                ]),
            ]),
            // query(':leave', [
            //   style({ opacity: 1, transform: 'none' }),
            //   stagger('150ms', [
            //     animate(
            //       '0.5s 100ms ease-out',
            //       style({ opacity: 0, transform: 'translateY(-100px)' })
            //     ),
            //   ]),
            // ]),
            // transition(':leave', [
            //   animate(
            //     '0.5s 100ms ease-out',
            //     style({ opacity: 0, transform: 'translateY(-100px)' })
            //   ),
            // ]),
        ]),
    ],
    imports: [MatCard, MatCardImage, MatCardContent]
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
