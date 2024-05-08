import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Tabs } from 'src/app/interfaces/tabs.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent extends Tabs {
  @Input() public tabTitle: string;
  screenWidth: number = window.innerWidth;
  screenHeight: number = window.innerHeight;

  private _maxWidth: number = this.screenWidth - 25 - 45;
  private _maxHeight: number = this.screenHeight - 25 - 145;

  // @ViewChild('tab', { read: ViewContainerRef }) tabTemplate: ViewContainerRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.maxWidth = this.screenWidth - 25 - 45;
    this.maxHeight = this.screenHeight - 25 - 145;
  }

  _result = [''];

  usernameFormInApp: FormGroup = this.fb.group({
    words: [''],
    specialCharacters: [''],
  });

  constructor(private fb: FormBuilder, private httpClient: HttpClient) {
    super();
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
        }
      )
      .subscribe((results) => {
        this.results = results;
      });
  }
}
