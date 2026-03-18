import {
  Component,
  HostListener,
  inject,
  signal,
  OnInit,
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
  imports: [
    CdkDrag,
    CdkDragHandle,
    MatIconModule,
    MatCardModule,
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

  private _maxWidth: number = this.screenWidth - 25 - 45;
  private _maxHeight: number = this.screenHeight - 25;

  public result = signal(['']);

  private usernameForm: FormGroup = this.fb.group({
    words: [''],
    specialCharacters: [''],
    appCheckToken: '',
  });

  public usernameFormInApp = model(this.usernameForm);

  callable = httpsCallable<unknown, AppCheckTokenResult>(
    this.functions,
    'unGenCallable',
  );

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

  onCompletionMsgChange($event: string) {
    if ($event !== 'Success') {
      this.snackBar.open($event, 'X', { panelClass: 'error' });
    }
  }
}
