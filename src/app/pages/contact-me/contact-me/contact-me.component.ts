import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { catchError } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatCardModule, MatCardContent } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'jzp-contact-me',
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss'],
  imports: [
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
  ],
})
export class ContactMeComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dbService = inject(DatabaseService);

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

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

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
