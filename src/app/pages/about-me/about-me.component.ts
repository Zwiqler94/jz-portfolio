/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, OnInit, VERSION } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
})
export class AboutMeComponent {
  _result = [''];

  usernameFormInApp: FormGroup = this.fb.group({
    words: [''],
    specialCharacters: [''],
  });

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
  ) {}

  // ngAfterContentInit(): void {
  //   const targeto: HTMLDivElement = document.getElementById(
  //     'creds'
  //   ) as HTMLDivElement;
  //   const scriptEl = document.createElement('script');
  //   scriptEl.src = 'https://cdn.credly.com/assets/utilities/embed.js';
  //   scriptEl.async = true;
  //   scriptEl.type = 'text/javascript';
  //   targeto.appendChild(scriptEl);
  // }

  onTabChange($event: MatTabChangeEvent) {
    if ($event.tab.textLabel === 'Credentials') {
      const scriptEl = document.createElement('script');
      scriptEl.src = 'https://cdn.credly.com/assets/utilities/embed.js';
      scriptEl.async = true;
      scriptEl.type = 'text/javascript';
      const targeto = document.querySelector(
        '#credential-div',
      ) as HTMLDivElement;
      targeto.append(scriptEl);
    }
  }

  get angularVersion() {
    return VERSION;
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

  onSubmit(token: any) {
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
