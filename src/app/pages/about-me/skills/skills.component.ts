import {
  animate,
  animateChild,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
} from '@angular/core';
import { environment } from 'src/environments/environment';

import { MatChipsModule } from '@angular/material/chips';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { TabComponent } from 'src/app/components/tab/tab.component';

interface SkillModel {
  skill: string;
  list: string;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  animations: [
    trigger('panelAnimation', [
      // state('start', style({ opacity: 1, transform: 'none' })),
      transition('void <=> *', [
        query(
          'div.mat-expansion-panel-content',
          [animateChild({ duration: '0.01ms' })],
          {
            optional: true,
          },
        ),
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-100px)' }),
            stagger('90ms', [
              animate(
                '0.5s 200ms ease-in',
                style({ opacity: 1, transform: 'none' }),
              ),
            ]),
          ],
          { optional: true },
        ),
        query(
          ':leave',
          [
            style({ opacity: 1, transform: 'none' }),
            stagger('5ms', [
              animate(
                '0.55s ease-in-out',
                style({ opacity: 0, transform: 'translateY(-100px)' }),
              ),
            ]),
          ],
          {
            optional: true,
          },
        ),
      ]),
      // transition('void <=> *', [
      //   query(
      //     'div.mat-expansion-panel-content',
      //     [animateChild({ duration: '0.01ms' })],
      //     {
      //       optional: true,
      //     },
      //   ),
      //   query(
      //     ':enter',
      //     [
      //       style({ opacity: 0, transform: 'translateY(-100px)' }),
      //       stagger('90ms', [
      //         animate(
      //           '1s 300ms ease-in',
      //           style({ opacity: 1, transform: 'none' }),
      //         ),
      //       ]),
      //     ],
      //     { optional: true },
      //   ),
      //   query(
      //     ':leave',
      //     [
      //       style({ opacity: 1, transform: 'none' }),
      //       stagger('20ms', [
      //         animate(
      //           '0.1s 10ms ease-out',
      //           style({ opacity: 0, transform: 'translateY(-100px)' }),
      //         ),
      //       ]),
      //     ],
      //     {
      //       optional: true,
      //     },
      //   ),
      // ]),
      // transition('credentials <=> skills', [
      //   query(
      //     'div.mat-expansion-panel-content',
      //     [animateChild({ duration: '0.01ms' })],
      //     {
      //       optional: true,
      //     },
      //   ),
      //   query(
      //     ':enter',
      //     [
      //       style({ opacity: 0, transform: 'translateY(-100px)' }),
      //       stagger('190ms', [
      //         animate(
      //           '0.5s 300ms ease-in',
      //           style({ opacity: 1, transform: 'none' }),
      //         ),
      //       ]),
      //     ],
      //     { optional: true },
      //   ),
      //   // query(
      //   //   ':leave',
      //   //   [
      //   //     style({ opacity: 1, transform: 'none' }),
      //   //     stagger('50ms', [
      //   //       animate(
      //   //         '0.5s 10ms ease-out',
      //   //         style({ opacity: 0, transform: 'translateY(-100px)' }),
      //   //       ),
      //   //     ]),
      //   //   ],
      //   //   {
      //   //     optional: true,
      //   //   },
      //   // ),
      // ]),
    ]),
  ],

  imports: [
    MatCardModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatChipsModule,
  ],
})
export class SkillsComponent extends TabComponent {
  private _skillList: SkillModel[];
  private _skillListDefault: SkillModel[] = [
    { list: 'Cloud', skill: 'AWS' },
    { list: 'Cloud', skill: 'Azure' },
    { list: 'Cloud', skill: 'Google Cloud Platform' },
    { list: 'Cloud', skill: 'IBM Cloud' },
    { list: 'Databases', skill: 'IBM Cloudant' },
    { list: 'Databases', skill: 'MongoDB' },
    { list: 'Databases', skill: 'PostgreSQL' },
    { list: 'Designs', skill: 'Angular Material' },
    { list: 'Designs', skill: 'Bootstrap' },
    { list: 'Designs', skill: 'IBM Carbon Design System' },
    { list: 'Frameworks', skill: 'Angular' },
    { list: 'Frameworks', skill: 'Chai' },
    { list: 'Frameworks', skill: 'Express' },
    { list: 'Frameworks', skill: 'Hyperledger Fabric' },
    { list: 'Frameworks', skill: 'Hyperledger Indy' },
    { list: 'Frameworks', skill: 'Mocha' },
    { list: 'Frameworks', skill: 'Supertest' },
    { list: 'Methodologies', skill: 'Agile Software Development' },
    { list: 'Methodologies', skill: 'Test-Driven Development' },
    { list: 'Programming', skill: 'C' },
    { list: 'Programming', skill: 'C++' },
    { list: 'Programming', skill: 'Go' },
    { list: 'Programming', skill: 'Haskell' },
    { list: 'Programming', skill: 'Java' },
    { list: 'Programming', skill: 'JavaScript' },
    { list: 'Programming', skill: 'Node.JS' },
    { list: 'Programming', skill: 'Prolog' },
    { list: 'Programming', skill: 'Python' },
    { list: 'Programming', skill: 'Ruby' },
    { list: 'Programming', skill: 'Typescript' },
    { list: 'Tools', skill: 'Cloud Foundry' },
    { list: 'Tools', skill: 'Docker' },
    { list: 'Tools', skill: 'Git' },
    { list: 'Tools', skill: 'Github' },
    { list: 'Tools', skill: 'Jenkins' },
    { list: 'Tools', skill: 'Jira' },
    { list: 'Tools', skill: 'Kubernetes' },
    { list: 'Tools', skill: 'Swagger/OpenAPI 3' },
  ];

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['tabTitle']) {
  //     this.prevTabTitle = this.tabTitle;
  //     this.prevTabTitleChange.emit(this.tabTitle);
  //     this.tabTitleChange.emit(this.tabTitle);
  //     console.log({ tab: this.tabTitle, prevTab: this.prevTabTitle });
  //   }
  // }

  public get skillList(): SkillModel[] {
    if (environment.production) {
      return this._skillList;
    } else return this._skillListDefault;
  }
  public set skillList(value) {
    if (environment.production) {
      this._skillList = value;
    } else this._skillListDefault = value;
  }
}
