import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
  model,
  signal,
} from '@angular/core';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { getApp } from '@angular/fire/app';
import {
  AppCheck,
  AppCheckTokenResult,
  ReCaptchaEnterpriseProvider,
  getToken,
  initializeAppCheck,
} from '@angular/fire/app-check';
import {
  Functions,
  getFunctions,
  httpsCallable,
} from '@angular/fire/functions';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  JSAnimation,
  Timeline,
  WAAPIAnimation,
  animate,
  createScope,
  createTimeline,
  cubicBezier,
  random,
  remove as animeRemove,
  stagger,
  waapi,
} from 'animejs';
import {
  AgeByNameComponent,
  NasaComponent,
  PokemonComponent,
  UsernameGeneratorComponent,
} from '@zwiqler94/everything-lib';
import { TabComponent } from 'src/app/components/tab/tab.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { environment } from 'src/environments/environment';

const USERNAME_GENERATOR_FUNCTION = new InjectionToken<Functions>(
  'USERNAME_GENERATOR_FUNCTION',
  {
    providedIn: 'root',
    factory: () => getFunctions(getApp('usernamegenerator')),
  },
);

const USERNAME_GENERATOR_APPCHECK = new InjectionToken<AppCheck>(
  'USERNAME_GENERATOR_APPCHECK',
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
    MatSnackBarModule,
    UsernameGeneratorComponent,
    PokemonComponent,
    NasaComponent,
    MatButtonModule,
    AgeByNameComponent,
  ],
})
export class ProjectsComponent
  extends TabComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly auth = inject(AuthService);
  private readonly functions = inject(USERNAME_GENERATOR_FUNCTION);
  private readonly usernameGeneratorAppCheck = inject(
    USERNAME_GENERATOR_APPCHECK,
  );
  private readonly animationScope = createScope({ root: this.host });
  private readonly haloCircumference = 113;

  screenWidth = typeof window === 'undefined' ? 0 : window.innerWidth;
  screenHeight = typeof window === 'undefined' ? 0 : window.innerHeight;
  expandedCard = signal<string | null>(null);
  result = signal<string[]>(['']);

  private _maxWidth = Math.max(this.screenWidth - 70, 280);
  private _maxHeight = Math.max(this.screenHeight - 25, 260);
  private readonly usernameForm: FormGroup = this.fb.group({
    words: [''],
    specialCharacters: [''],
    appCheckToken: '',
  });

  readonly usernameFormInApp = model(this.usernameForm);

  @ViewChildren('dashboardCard')
  dashboardCards!: QueryList<ElementRef<HTMLElement>>;

  @ViewChildren('dragHandle', { read: ElementRef })
  dragHandles!: QueryList<ElementRef<HTMLButtonElement>>;

  @ViewChildren('dragHalo', { read: ElementRef })
  dragHalos!: QueryList<ElementRef<SVGCircleElement>>;

  private cardsTimeline?: Timeline;
  private haloAnimation?: JSAnimation;
  private handleFloatAnimation?: WAAPIAnimation;
  private viewportCleanup?: () => void;

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
    { label: 'Stack', value: 'Firebase, Angular' },
  ];
  readonly roadmapStats = [
    { label: 'Slots', value: '+2' },
    { label: 'Ideas', value: 'Open' },
    { label: 'Status', value: 'Ideating' },
  ];

  readonly callable = httpsCallable<unknown, AppCheckTokenResult>(
    this.functions,
    'unGenCallable',
  );
  appCheckToken = '';

  openSmartPick(): void {
    window.open(
      'https://lotto-beast-new.web.app',
      '_blank',
      'noopener,noreferrer',
    );
  }

  onResize(): void {
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

  async ngOnInit(): Promise<void> {
    try {
      let appCheckToken = '';
      if (this.auth.appCheckToken) {
        appCheckToken = this.auth.appCheckToken;
      } else {
        const tokenResult = await this.auth.getAppCheckToken('projects');
        if (tokenResult?.token) {
          appCheckToken = tokenResult.token;
        }
      }

      getToken(this.usernameGeneratorAppCheck).then((tokenResult) => {
        if (tokenResult?.token) {
          this.appCheckToken = tokenResult.token;
        }
      });

      this.usernameForm.patchValue({ appCheckToken });
      this.usernameFormInApp.set(this.usernameForm);
    } catch (error) {
      console.error('Error initializing component:', error);
    }
  }

  ngAfterViewInit(): void {
    this.setCardsMotionState('idle');
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

  get nasaApiKey(): string {
    return environment.nasaAPIKey;
  }

  set maxWidth(value: number) {
    this._maxWidth = value;
  }

  get maxWidth(): string {
    return `${this._maxWidth}px`;
  }

  set maxHeight(value: number) {
    this._maxHeight = value;
  }

  get maxHeight(): string {
    return `${this._maxHeight}px`;
  }

  toggleDetails(cardId: string): void {
    this.expandedCard.set(this.expandedCard() === cardId ? null : cardId);
  }

  isExpanded(cardId: string): boolean {
    return this.expandedCard() === cardId;
  }

  private animateCards(): void {
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

      this.animationScope.add(() => {
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
            translateY: [36, 0],
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

  private animateDragHandles(): void {
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

      this.animationScope.add(() => {
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

  private resetCards(cards: HTMLElement[]): void {
    this.cardsTimeline?.revert();
    this.cardsTimeline = undefined;
    animeRemove(cards);
    cards.forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    this.setCardsMotionState('idle');
  }

  private resetHandles(
    handles: HTMLElement[],
    halos: SVGCircleElement[],
  ): void {
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

  private enableEnhancedMotion(): void {
    this.host.nativeElement.classList.add('motion-enhanced');
  }

  private disableEnhancedMotion(): void {
    this.host.nativeElement.classList.remove('motion-enhanced');
  }

  private setCardsMotionState(state: 'idle' | 'running' | 'finished'): void {
    this.host.nativeElement.dataset['cardsMotion'] = state;
  }

  private shouldReduceMotion(): boolean {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );
  }

  private supportsWAAPI(): boolean {
    return (
      typeof Element !== 'undefined' &&
      typeof Element.prototype.animate === 'function'
    );
  }

  private attachViewportListeners(): void {
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

  private setViewportVars(width: number, height: number): void {
    const host = this.host.nativeElement;
    host.style.setProperty('--app-vw', `${width}px`);
    host.style.setProperty('--app-vh', `${height}px`);
  }

  onCompletionMsgChange(message: string): void {
    if (message !== 'Success') {
      this.snackBar.open(message, 'X', { panelClass: 'error' });
    }
  }
}
