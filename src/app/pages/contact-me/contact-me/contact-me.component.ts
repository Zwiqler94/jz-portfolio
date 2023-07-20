import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-contact-me',
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss'],
})
export class ContactMeComponent {
  contactForm: FormGroup = this.fb.group({
    name: [''],
    email: [''],
    message: [''],
    access_key: ['48806eff-c6bb-4255-984d-ce3fd29ab89f'],
    redirect: ['https://web3forms.com/success'],
  });

  private _x = new FormData();
  public get x() {
    return this._x;
  }
  public set x(value) {
    this._x = value;
  }

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  async onSubmit() {
    this.http
      .post(
        'https://api.web3forms.com/submit',
        JSON.stringify(this.contactForm.value),
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
        }
      )
      .subscribe((val) => console.log(val));
  }

  handleError = (error: HttpErrorResponse) => {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  };

  async updateFormData() {
    for (const control in this.contactForm.value) {
      console.log(control, this.contactForm.get(control)?.value);
      this.x.append(control, this.contactForm.get(control)?.value);
    }
  }
}
