import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jzp-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})
export class ErrorPageComponent {
  private router = inject(Router);

  async goHome() {
    return await this.router.navigateByUrl('/home');
  }
}
