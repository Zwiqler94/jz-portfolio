/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Component, VERSION } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
})
export class AboutMeComponent {
  _result: string[] = [''];

  usernameForm: FormGroup = this.fb.group({
    words: [''],
    specialCharacters: [''],
  });

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
  ) {}

  get angularVersion() {
    return VERSION;
  }

  get results() {
    return this._result;
  }

  set results(result: string[]) {
    this._result = result;
  }

  onSubmit(_token: any) {
    const body = {
      words: (this.usernameForm.get('words')?.value as string).split(','),
      specials: (
        this.usernameForm.get('specialCharacters')?.value as string
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
