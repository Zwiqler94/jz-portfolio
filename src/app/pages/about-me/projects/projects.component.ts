import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { JzTabGroupComponent } from 'src/app/components/jz-tab/jz-tab-group.component';
import { Tabs } from 'src/app/interfaces/tabs.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent extends Tabs {
  @Input() public tabTitle: string;
  // @ViewChild('tab', { read: ViewContainerRef }) tabTemplate: ViewContainerRef;

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

  get nasaApiKey() {
    return environment.nasaAPIKey;
  }

  get results() {
    return this._result;
  }

  set results(result: string[]) {
    this._result = result;
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
