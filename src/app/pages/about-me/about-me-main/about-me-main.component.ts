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
        animate(
          '0.5s 100ms ease-out',
          style({ opacity: 0, transform: 'translateY(-100px)' })
        ),
      ]),
    ]),
    trigger('sideAnisLeft', [
      // transition(':enter', []),
      transition(':enter', [
        query('.side-image', [
          style({ opacity: 0, transform: 'translateX(-300px)' }),
          stagger('90ms', [
            animate(
              '0.5s 200ms ease-in',
              style({ opacity: 1, transform: 'none' })
            ),
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
            animate(
              '0.5s 100ms ease-out',
              style({ opacity: 0, transform: 'translateX(-300px)' })
            ),
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
            animate(
              '0.5s 200ms ease-in',
              style({ opacity: 1, transform: 'none' })
            ),
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
            animate(
              '0.5s 100ms ease-out',
              style({ opacity: 0, transform: 'translateX(300px)' })
            ),
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
})
export class AboutMeMainComponent extends Tabs implements OnChanges {
  @Input() public tabTitle: string;
  @Input() prevTabTitle: string;
  @Output() tabTitleChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() prevTabTitleChange: EventEmitter<string> =
    new EventEmitter<string>();

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tabTitle']) {
      this.prevTabTitle = this.tabTitle;
      this.prevTabTitleChange.emit(this.tabTitle);
      this.tabTitleChange.emit(this.tabTitle);
      console.log({ tab: this.tabTitle, prevTab: this.prevTabTitle });
    }
  }
}
