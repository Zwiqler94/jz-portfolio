/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Component,
  OnInit,
  Renderer2,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.scss'],
})
export class SocialsComponent implements OnInit, AfterViewInit {
  instagramScript: any;
  twitterScript: any;

  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private domDocument: any,
    private router: Router,
  ) {
    // if (this.router.navigated === true) {
    //   location.reload();
    // }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    try {
      this.loadScripts();
    } catch (error) {
      console.log(error);
    }
    // this.instagramScript.loaded = false;
    // this.twitterScript.loaded = false;
  }

  loadScripts(): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptEl = document.createElement('script');
      scriptEl.src = 'https://www.instagram.com/embed.js';
      scriptEl.async = true;
      scriptEl.type = 'text/javascript';
      const targeto = document.querySelectorAll<HTMLDivElement>('.insta-posts');
      targeto.forEach((node: HTMLDivElement) => node.append(scriptEl));
    });
  }
}
