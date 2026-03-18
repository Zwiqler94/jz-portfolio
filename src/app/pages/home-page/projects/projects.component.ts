import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  inject,
  signal,
  OnInit,
  OnDestroy,
  model,
  ChangeDetectionStrategy,
  EnvironmentInjector,
  InjectionToken,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { NgZone } from '@angular/core';
import {
  JSAnimation,
  Timeline,
  WAAPIAnimation,
  animate,
  createScope,
  createTimeline,
  random,
  remove as animeRemove,
  stagger,
  waapi,
  cubicBezier,
} from 'animejs';
import {
  AgeByNameComponent,
  NasaComponent,
  PokemonComponent,
  UsernameGeneratorComponent,
} from '@zwiqler94/everything-lib';
import { TabComponent } from 'src/app/components/tab/tab.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import {
  Functions,
  getFunctions,
  httpsCallable,
  provideFunctions,
} from '@angular/fire/functions';
import {
  AppCheck,
  AppCheckTokenResult,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from '@angular/fire/app-check';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { MatButtonModule } from '@angular/material/button';

const USERNAME_GENERATOR_FUNCTION = new InjectionToken<Functions>(
  'USERNAME_GENERATOR_FUNCTION',
  {
    providedIn: 'root',
    factory: () => getFunctions(getApp('usernamegenerator')),
  },
);

const USERNAME_GENERATOR_APPCHECK = new InjectionToken<AppCheck>(
  'USERNAME_GENERATOR_FUNCTION',
  {
    providedIn: 'root',
    factory: () =>
      initializeAppCheck(getApp('usernamegenerator'), {
        provider: new ReCaptchaEnterpriseProvider(
          '6LfmZfkrAAAAAMikpjz1sRW1AYE6I7j8XuTA1m8o',
        ),
        isTokenAutoRefreshEnabled: true,
      }),
  },
);

@Component({
  selector: 'jzp-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()',
  },
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
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent extends TabComponent implements OnInit {
  openSmartPick() {
    window.open('https://lotto-beast-new.web.app', '_blank');
  }

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private auth = inject(AuthService);
  private functions = inject(USERNAME_GENERATOR_FUNCTION);
  private appCheck = inject(USERNAME_GENERATOR_APPCHECK);

  screenWidth: number = window.innerWidth;
  screenHeight: number = window.innerHeight;
  widgetCount = 8;
  expandedCard = signal<string | null>(null);

  private _maxWidth: number = this.screenWidth - 25 - 45;
  private _maxHeight: number = this.screenHeight - 25;

  public result = signal(['']);

  private usernameForm: FormGroup = this.fb.group({
    words: [''],
    specialCharacters: [''],
    appCheckToken: '',
  });

  public usernameFormInApp = model(this.usernameForm);
  @ViewChildren('dashboardCard')
  dashboardCards!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('dragHandle', { read: ElementRef })
  dragHandles!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('dragHalo', { read: ElementRef })
  dragHalos!: QueryList<ElementRef<SVGCircleElement>>;

  private cardsTimeline?: Timeline;
  private haloAnimation?: JSAnimation;
  private handleFloatAnimation?: WAAPIAnimation;
  private readonly haloCircumference = 113;
  private viewportCleanup?: () => void;

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
  readonly roadmapStats = [
    { label: 'Slots', value: '+2' },
    { label: 'Ideas', value: 'Open' },
    { label: 'Status', value: 'Ideating' },
  ];

  callable = httpsCallable<unknown, AppCheckTokenResult>(
    this.functions,
    'unGenCallable',
  );

  @HostListener('window:resize')
  onResize() {
    if (typeof window === 'undefined') return;
    const viewport = window.visualViewport;
    const width = viewport?.width ?? window.innerWidth;
    const height = viewport?.height ?? window.innerHeight;

    this.screenWidth = Math.round(width);
    this.screenHeight = Math.round(height);

    const horizontalPadding =
      this.screenWidth > 1280 ? 240 : this.screenWidth > 900 ? 160 : 96;
    const effectiveWidth = Math.max(280, this.screenWidth - horizontalPadding);
    this.maxWidth = effectiveWidth;

    const viewportSlices =
      this.screenWidth > 1024
        ? 2.75
        : this.screenWidth > 768
          ? 2.2
          : this.screenWidth > 540
            ? 1.6
            : 1.15;
    const effectiveHeight = Math.max(
      260,
      Math.floor((this.screenHeight - 32) / viewportSlices),
    );
    this.maxHeight = effectiveHeight;

    this.setViewportVars(this.screenWidth, this.screenHeight);
  }

  constructor() {
    super();
    this.result.set(['']);
    this.setCardsMotionState('idle');
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
    this.onResize();
    this.attachViewportListeners();
    this.animateCards();
    this.animateDragHandles();
    if (this.dashboardCards) {
      this.dashboardCards.changes.subscribe(() => this.animateCards());
    }
    if (this.dragHandles) {
      this.dragHandles.changes.subscribe(() => this.animateDragHandles());
    }
    if (this.dragHalos) {
      this.dragHalos.changes.subscribe(() => this.animateDragHandles());
    }
  }

  ngOnDestroy(): void {
    this.viewportCleanup?.();
    this.viewportCleanup = undefined;
    this.cardsTimeline?.revert();
    this.cardsTimeline = undefined;
    this.haloAnimation?.revert();
    this.haloAnimation = undefined;
    this.handleFloatAnimation?.cancel();
    this.handleFloatAnimation = undefined;
    this.animationScope.revert();
    this.disableEnhancedMotion();
  }

  private animateCards() {
    const cards =
      this.dashboardCards?.toArray().map((card) => card.nativeElement) ?? [];
    if (!cards.length) return;

    if (this.shouldReduceMotion()) {
      this.resetCards(cards);
      return;
    }

    this.zone.runOutsideAngular(() => {
      animeRemove(cards);
      this.cardsTimeline?.revert();
      this.cardsTimeline = undefined;

      this.animationScope.execute(() => {
        const entryStagger = stagger(110, { ease: 'linear', from: 'first' });
        const timeline = createTimeline({
          defaults: {
            duration: 640,
            ease: cubicBezier(0.35, 0.7, 0, 1),
          },
          onBegin: () => this.setCardsMotionState('running'),
          onComplete: () => this.setCardsMotionState('finished'),
        });

        timeline
          .add(cards, {
            opacity: [0, 1],
            translateY: (_: any, index: number) => [32 + index * 3, 0],
            rotate: () => [random(-1.5, 1.5), 0],
            scale: [0.95, 1],
            delay: entryStagger,
          })
          .add(
            cards,
            {
              scale: [1, 1.015],
              translateX: () => [random(-6, 6), 0],
              easing: 'spring(1, 90, 14, 0)',
              duration: 900,
              delay: entryStagger,
            },
            '-=320',
          );

        this.cardsTimeline = timeline;
      });
    });
  }

  private animateDragHandles() {
    const handles =
      this.dragHandles?.toArray().map((handle) => handle.nativeElement) ?? [];
    if (!handles.length) return;

    const halos =
      this.dragHalos?.toArray().map((halo) => halo.nativeElement) ?? [];

    if (this.shouldReduceMotion() || !this.supportsWAAPI()) {
      this.resetHandles(handles, halos);
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.handleFloatAnimation?.cancel();
      this.handleFloatAnimation = undefined;
      this.haloAnimation?.revert();
      this.haloAnimation = undefined;

      this.animationScope.execute(() => {
        this.handleFloatAnimation = waapi.animate(handles, {
          translateY: [-4, 4],
          rotate: [-3, 3],
          duration: 2200,
          delay: stagger(95, { from: 'center', ease: 'easeOutQuad' }),
          alternate: true,
          loop: true,
          ease: 'linear(0, 0.25, 1)',
        });

        if (halos.length) {
          this.haloAnimation = animate(halos, {
            strokeDashoffset: [this.haloCircumference, 0],
            opacity: [0.2, 0.75],
            duration: 1800,
            delay: stagger(160, { from: 'last' }),
            easing: 'easeInOutSine',
            loop: true,
            alternate: true,
          });
        }
      });

      this.enableEnhancedMotion();
    });
  }

  private resetCards(cards: HTMLElement[]) {
    this.cardsTimeline?.revert();
    this.cardsTimeline = undefined;
    animeRemove(cards);
    cards.forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    this.setCardsMotionState('idle');
  }

  private resetHandles(handles: HTMLElement[], halos: SVGCircleElement[]) {
    this.handleFloatAnimation?.cancel();
    this.handleFloatAnimation = undefined;
    this.haloAnimation?.revert();
    this.haloAnimation = undefined;
    handles.forEach((handle) => {
      handle.style.removeProperty('transform');
    });
    halos.forEach((halo) => {
      halo.style.opacity = '0';
      halo.style.strokeDashoffset = `${this.haloCircumference}`;
    });
    this.disableEnhancedMotion();
  }

  private enableEnhancedMotion() {
    this.host.nativeElement.classList.add('motion-enhanced');
  }

  private disableEnhancedMotion() {
    this.host.nativeElement.classList.remove('motion-enhanced');
  }

  private setCardsMotionState(state: 'idle' | 'running' | 'finished') {
    this.host.nativeElement.dataset.cardsMotion = state;
  }

  private shouldReduceMotion() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );
  }

  private supportsWAAPI() {
    return (
      typeof Element !== 'undefined' &&
      typeof Element.prototype.animate === 'function'
    );
  }

  private attachViewportListeners() {
    if (typeof window === 'undefined' || !window.visualViewport) {
      return;
    }
    const viewport = window.visualViewport;
    const handler = () => this.onResize();
    viewport.addEventListener('resize', handler);
    viewport.addEventListener('scroll', handler);
    this.viewportCleanup = () => {
      viewport.removeEventListener('resize', handler);
      viewport.removeEventListener('scroll', handler);
    };
  }

  private setViewportVars(width: number, height: number) {
    const host = this.host.nativeElement;
    host.style.setProperty('--app-vw', `${width}px`);
    host.style.setProperty('--app-vh', `${height}px`);
  }

  onCompletionMsgChange($event: string) {
    if ($event !== 'Success') {
      this.snackBar.open($event, 'X', { panelClass: 'error' });
    }
  }
}
