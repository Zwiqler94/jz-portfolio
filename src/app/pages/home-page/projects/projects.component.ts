import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
  inject,
  signal,
  OnInit,
  model,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { NgZone } from '@angular/core';
import { animate, remove as animeRemove, stagger } from 'animejs';
import {
  AgeByNameComponent,
  NasaComponent,
  PokemonComponent,
  UsernameGeneratorComponent,
} from '@zwiqler94/everything-lib';
import { TabComponent } from 'src/app/components/tab/tab.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'jzp-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports: [
    CdkDrag,
    CdkDragHandle,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    UsernameGeneratorComponent,
    PokemonComponent,
    NasaComponent,
    AgeByNameComponent,
  ],
})
export class ProjectsComponent
  extends TabComponent
  implements OnInit, AfterViewInit
{
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private auth = inject(AuthService);
  private zone = inject(NgZone);

  screenWidth: number = window.innerWidth;
  screenHeight: number = window.innerHeight;
  widgetCount = 8;
  expandedCard = signal<string | null>(null);

  private _maxWidth: number = this.screenWidth - 25 - 45;
  private _maxHeight: number = (this.screenHeight - 25) / 8;

  public result = signal(['']);

  private usernameForm: FormGroup = this.fb.group({
    words: [''],
    specialCharacters: [''],
    appCheckToken: '',
  });

  public usernameFormInApp = model(this.usernameForm);
  @ViewChildren('dashboardCard')
  dashboardCards!: QueryList<ElementRef<HTMLElement>>;

  readonly usernameStats = [
    { label: 'Ideas Saved', value: '24' },
    { label: 'Avg. Length', value: '12 chars' },
    { label: 'App Check', value: 'Verified' },
  ];
  readonly nasaStats = [
    { label: 'Photos Cached', value: '5' },
    { label: 'API Mode', value: 'Demo' },
    { label: 'Status', value: 'Live' },
  ];
  readonly pokemonStats = [
    { label: 'Dex Window', value: 'Random' },
    { label: 'Sprites', value: 'Hi-Res' },
    { label: 'Mood', value: 'Playful' },
  ];
  readonly ageStats = [
    { label: 'Dataset', value: 'Global' },
    { label: 'Latency', value: 'Low' },
    { label: 'Fun Fact', value: 'Predictive' },
  ];
  readonly iframeStats = [
    { label: 'Surface', value: 'SmartPick' },
    { label: 'Mode', value: 'Live Demo' },
    { label: 'Stack', value: 'Firebase' },
  ];

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.maxWidth = this.screenWidth - 25 - 45;
    this.maxHeight = (this.screenHeight - 25) / 8;
  }

  constructor() {
    super();
    this.result.set(['']);
  }

  async ngOnInit(): Promise<void> {
    try {
      let appCheckToken = ''; //this.auth.appCheckToken ?? this.auth.getAppCheckToken('projects');
      if (this.auth.appCheckToken) appCheckToken = this.auth.appCheckToken;
      else {
        const tokenResult = await this.auth.getAppCheckToken('projects');
        if (tokenResult?.token) appCheckToken = tokenResult.token;
      }

      this.usernameForm.patchValue({ appCheckToken });

      this.usernameFormInApp.set(this.usernameForm);
    } catch (error) {
      console.error('Error initializing component:', error);
    }
  }

  get nasaApiKey() {
    return environment.nasaAPIKey;
  }

  // get results() {
  //   return this._result();
  // }

  // set results(result: string[]) {
  //   this._result.set(result);
  // }

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

  toggleDetails(cardId: string) {
    this.expandedCard.set(this.expandedCard() === cardId ? null : cardId);
  }

  isExpanded(cardId: string) {
    return this.expandedCard() === cardId;
  }

  ngAfterViewInit(): void {
    this.animateCards();
    if (this.dashboardCards) {
      this.dashboardCards.changes.subscribe(() => this.animateCards());
    }
  }

  private animateCards() {
    const cards =
      this.dashboardCards?.toArray().map((card) => card.nativeElement) ?? [];
    if (!cards.length) return;

    if (this.shouldReduceMotion()) {
      cards.forEach((card) => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
      return;
    }

    this.zone.runOutsideAngular(() => {
      animeRemove(cards);
      animate(cards, {
        opacity: [0, 1],
        translateY: [24, 0],
        scale: [0.97, 1],
        delay: stagger(120),
        duration: 600,
        easing: 'easeOutCubic',
      });
    });
  }

  private shouldReduceMotion() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );
  }

  onCompletionMsgChange($event: string) {
    if ($event !== 'Success') {
      this.snackBar.open($event, 'X', { panelClass: 'error' });
    }
  }
}
