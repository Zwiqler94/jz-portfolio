import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { catchError } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from 'src/app/services/database/database.service';

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
    private dbService: DatabaseService,
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
      .pipe(catchError(this.dbService.handleError))
      .subscribe({
        next: (val) => console.debug(val),
        error: console.error,
        complete: () => {
          this.snackBar.open('Message Sent Successfully', 'X');
        },
      });
  }

  async updateFormData() {
    for (const control in this.contactForm.value) {
      console.debug(control, this.contactForm.get(control)?.value);
      this.form.append(control, this.contactForm.get(control)?.value);
    }
  }
}
