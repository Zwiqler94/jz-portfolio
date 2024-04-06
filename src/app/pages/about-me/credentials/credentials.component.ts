import {
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
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

            stagger('50ms', [
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
export class CredentialsComponent extends Tabs implements OnInit {
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
    console.log(this.profile);
  }
  @Input() tabTitle: string;
}
