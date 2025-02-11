import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule, MatMiniFabButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'jzp-nav-bar',
  imports: [
    MatButtonModule,
    MatIcon,
    MatToolbar,
    MatMiniFabButton,
    MatDivider,
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  drawer = input.required<MatSidenav>();
  logoutFn = input.required<() => void>();
}
