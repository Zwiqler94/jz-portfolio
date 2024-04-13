import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MicrosoftLearnUserProfile } from 'src/app/interfaces/microsoft/microsoft';
import { Tabs } from 'src/app/interfaces/tabs.model';
import credInfo from 'src/assets/credentials/msft_credentials.json';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
  animations: [
    trigger('credys', [
      // state('start', style({ opacity: 1, transform: 'none' })),
      // transition(':enter', []),
      transition('void <=> *', [
        query(
          ':enter',
          [
            style({ visibility: 'hidden' }),
            style({
              visibility: 'visible',
              opacity: 0,
              transform: 'translateY(-100px)',
            }),
            stagger('90ms', [
              animate(
                '3s 500ms cubic-bezier(1, 5, 1, 1)',
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

            stagger('5ms', [
              animate(
                '0.5s ease-out',
                style({ opacity: 0, transform: 'translateY(-300px)' })
              ),
            ]),
          ],
          {
            optional: true,
          }
        ),
      ]),
      // transition(
      //   ':enter',
      //   [
      //     // query(
      //     //   ':enter',
      //     //   [
      //     //     style({ opacity: 0, transform: 'translateY(-100px)' }),
      //     //     stagger('90ms', [
      //     //       animate(
      //     //         '0.5s 200ms ease-in',
      //     //         style({ opacity: 1, transform: 'none' })
      //     //       ),
      //     //     ]),
      //     //   ],
      //     //   { optional: true }
      //     // ),
      //     query(
      //       ':leave',
      //       [
      //         stagger('50ms', [
      //           animate(
      //             '0.5s 200ms ease-out',
      //             style({ opacity: 0, transform: 'translateY(-100px)' })
      //           ),
      //         ]),
      //       ],
      //       {
      //         optional: true,
      //       }
      //     ),
      //   ]
      // ),
      // transition(
      //   'skills <=> credentials, main => credentials, projects => credentials',
      //   [
      //     query(
      //       ':enter',
      //       [
      //         style({ opacity: 0, transform: 'translateY(-100px)' }),
      //         stagger('90ms', [
      //           animate(
      //             '0.5s 200ms ease-in',
      //             style({ opacity: 1, transform: 'none' })
      //           ),
      //         ]),
      //       ],
      //       { optional: true }
      //     ),
      //     // query(
      //     //   ':leave',
      //     //   [
      //     //     style({ opacity: 1, transform: 'none' }),

      //     //     stagger('5ms', [
      //     //       animate(
      //     //         '0.5s 100ms ease-out',
      //     //         style({ opacity: 0, transform: 'translateY(-100px)' })
      //     //       ),
      //     //     ]),
      //     //   ],
      //     //   {
      //     //     optional: true,
      //     //   }
      //     // ),
      //   ]
      // ),
      // transition(':leave', [
      //   style({ opacity: 0, transform: 'translateY(-100px)' }),
      //   animate('0.5s 100ms ease-out'),
      // ]),
    ]),
  ],
})
export class CredentialsComponent extends Tabs implements OnInit, OnChanges {
  @Input() tabTitle: string;
  @Input() prevTabTitle: string;
  @Output() tabTitleChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() prevTabTitleChange: EventEmitter<string> =
    new EventEmitter<string>();

  MICROSOFT_LEARN_URL = 'https://learn.microsoft.com/en-us';
  profile: MicrosoftLearnUserProfile;

  ngOnInit(): void {
    const scriptEl = document.createElement('script');
    scriptEl.src = 'https://cdn.credly.com/assets/utilities/embed.js';
    scriptEl.async = true;
    scriptEl.type = 'text/javascript';
    const targeto = document.querySelector('.credential-div') as HTMLDivElement;
    targeto.append(scriptEl);

    this.profile = new MicrosoftLearnUserProfile(credInfo);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tabTitle']) {
      this.prevTabTitle = this.tabTitle;
      this.prevTabTitleChange.emit(this.tabTitle);
      this.tabTitleChange.emit(this.tabTitle);
      console.log({ tab: this.tabTitle, prevTab: this.prevTabTitle });
    }
  }
}
