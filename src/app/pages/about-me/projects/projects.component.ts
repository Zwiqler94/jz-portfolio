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
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Tabs } from 'src/app/interfaces/tabs.model';
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  AgeByNameComponent,
  BoredomSolverComponent,
  NasaComponent,
  PokemonComponent,
  UsernameGeneratorComponent,
} from '@zwiqler94/everything-lib';

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
                query(':enter', [
                    style({ opacity: 0, transform: 'translateY(-100px)' }),
                    stagger('190ms', [
                        animate('0.8s 300ms ease-in', style({ opacity: 1, transform: 'none' })),
                    ]),
                ], { optional: true }),
                query(':leave', [
                    style({ opacity: 1, transform: 'none' }),
                    stagger('50ms', [
                        animate('0.5s 10ms ease-out', style({ opacity: 0, transform: 'translateY(-100px)' })),
                    ]),
                ], {
                    optional: true,
                }),
            ]),
        ]),
    ],
    imports: [
        CdkDrag,
        CdkDragHandle,
        MatIcon,
        MatCardModule,
        MatSnackBarModule,
        UsernameGeneratorComponent,
        PokemonComponent,
        BoredomSolverComponent,
        NasaComponent,
        AgeByNameComponent,
    ]
})
export class ProjectsComponent extends Tabs {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  @Input() public tabTitle: string;
  screenWidth: number = window.innerWidth;
  screenHeight: number = window.innerHeight;
  widgetCount = 8;

  private _maxWidth: number = this.screenWidth - 25 - 45;
  private _maxHeight: number = (this.screenHeight - 25) / 8;

  // @ViewChild('tab', { read: ViewContainerRef }) tabTemplate: ViewContainerRef;

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.maxWidth = this.screenWidth - 25 - 45;
    this.maxHeight = (this.screenHeight - 25) / 8;
  }

  _result = [''];

  usernameFormInApp: FormGroup = this.fb.group({
    words: [''],
    specialCharacters: [''],
  });

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tabTitle']) {
      this.prevTabTitle = this.tabTitle;

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

  public set maxHeight(value: number) {
    this._maxHeight = value;
  }

  public get maxHeight(): string {
    return `${this._maxHeight}px`;
  }

  onCompletionMsgChange($event: string) {
    if ($event !== 'Success') {
      this.snackBar.open($event, 'X', { panelClass: '.error' });
    }
  }
}
