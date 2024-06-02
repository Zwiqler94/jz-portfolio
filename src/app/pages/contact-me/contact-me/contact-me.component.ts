import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-me',
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss'],
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIcon,
  ],
})
export class ContactMeComponent {
  contactForm: FormGroup = this.fb.group({
    name: [''],
    email: [''],
    message: [''],
    access_key: ['48806eff-c6bb-4255-984d-ce3fd29ab89f'],
    redirect: ['https://web3forms.com/success'],
  });

  private _form = new FormData();
  public get form() {
    return this._form;
  }
  public set form(value) {
    this._form = value;
  }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {}

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
        },
      )
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (val) => console.log(val),
        error: console.error,
        complete: () => {
          this.snackBar.open('Message Sent Successfully', 'X');
        },
      });
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
        error.error,
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.'),
    );
  };

  async updateFormData() {
    for (const control in this.contactForm.value) {
      console.log(control, this.contactForm.get(control)?.value);
      this.form.append(control, this.contactForm.get(control)?.value);
    }
  }
}
