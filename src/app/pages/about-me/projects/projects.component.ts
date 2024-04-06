import {
  transition,
  query,
  animateChild,
  style,
  stagger,
  animate,
  trigger,
} from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Tabs } from 'src/app/interfaces/tabs.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [
    // transition('* <=> *', [
    //   query(
    //     'div.mat-expansion-panel-content',
    //     [animateChild({ duration: '0.01ms' })],
    //     {
    //       optional: true,
    //     }
    //   ),
    //   query(
    //     ':enter',
    //     [
    //       style({ opacity: 0, transform: 'translateY(-100px)' }),
    //       stagger('90ms', [
    //         animate(
    //           '1s 300ms ease-in',
    //           style({ opacity: 1, transform: 'none' })
    //         ),
    //       ]),
    //     ],
    //     { optional: true }
    //   ),
    //   query(
    //     ':leave',
    //     [
    //       style({ opacity: 1, transform: 'none' }),
    //       stagger('50ms', [
    //         animate(
    //           '0.5s 100ms ease-out',
    //           style({ opacity: 0, transform: 'translateY(-100px)' })
    //         ),
    //       ]),
    //     ],
    //     {
    //       optional: true,
    //     }
    //   ),
    // ]),
    // transition('void <=> *', [
    //   query(
    //     'div.mat-expansion-panel-content',
    //     [animateChild({ duration: '0.01ms' })],
    //     {
    //       optional: true,
    //     }
    //   ),
    //   query(
    //     ':enter',
    //     [
    //       style({ opacity: 0, transform: 'translateY(-100px)' }),
    //       stagger('90ms', [
    //         animate(
    //           '1s 300ms ease-in',
    //           style({ opacity: 1, transform: 'none' })
    //         ),
    //       ]),
    //     ],
    //     { optional: true }
    //   ),
    //   query(
    //     ':leave',
    //     [
    //       style({ opacity: 1, transform: 'none' }),
    //       stagger('50ms', [
    //         animate(
    //           '0.5s 10ms ease-out',
    //           style({ opacity: 0, transform: 'translateY(-100px)' })
    //         ),
    //       ]),
    //     ],
    //     {
    //       optional: true,
    //     }
    //   ),
    // ]),
    trigger('projectsAnimation', [
      transition('projects <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-100px)' }),
            stagger('190ms', [
              animate(
                '0.8s 300ms ease-in',
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
            stagger('50ms', [
              animate(
                '0.5s 10ms ease-out',
                style({ opacity: 0, transform: 'translateY(-100px)' }),
              ),
            ]),
          ],
          {
            optional: true,
          },
        ),
      ]),
    ]),
  ],
})
export class ProjectsComponent extends Tabs implements OnChanges {
  @Input() tabTitle: string;
  @Input() prevTabTitle: string;
  @Output() tabTitleChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() prevTabTitleChange: EventEmitter<string> =
    new EventEmitter<string>();

  screenWidth: number = window.innerWidth;
  screenHeight: number;

  private _maxWidth: number = this.screenWidth - 45;

  // @ViewChild('tab', { read: ViewContainerRef }) tabTemplate: ViewContainerRef;

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.maxWidth = this.screenWidth - 45;
  }

  _result = [''];

  usernameFormInApp: FormGroup = this.fb.group({
    words: [''],
    specialCharacters: [''],
  });

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tabTitle']) {
      this.prevTabTitle = this.tabTitle;
      this.prevTabTitleChange.emit(this.tabTitle);
      this.tabTitleChange.emit(this.tabTitle);
      console.log({ tab: this.tabTitle, prevTab: this.prevTabTitle });
    }
  }

  get nasaApiKey() {
    return environment.nasaAPIKey;
  }

  get results() {
    return this._result;
  }

  set results(result: string[]) {
    this._result = result;
  }

  public set maxWidth(value: number) {
    this._maxWidth = value;
  }

  public get maxWidth(): string {
    return `${this._maxWidth}px`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit(_token: unknown) {
    const body = {
      words: (this.usernameFormInApp.get('words')?.value as string).split(','),
      specials: (
        this.usernameFormInApp.get('specialCharacters')?.value as string
      ).split(','),
    };
    console.log(body);
    this.httpClient
      .post<string[]>(
        'https://us-central1-usernamegenerator.cloudfunctions.net/usernameGeneratorAPI/usernames',
        body,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        },
      )
      .subscribe((results) => {
        this.results = results;
      });
  }
}
