import {
  Component,
  HostListener,
  inject,
  signal,
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
  ],
})
export class ProjectsComponent extends TabComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

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

  result = signal(['']);

  private usernameForm: FormGroup<any> = this.fb.group({
    words: [''],
    specialCharacters: [''],
  });

  usernameFormInApp = signal(this.usernameForm);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
    this.result.set(['']);
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
      this.snackBar.open($event, 'X', { panelClass: '.error' });
    }
  }
}
