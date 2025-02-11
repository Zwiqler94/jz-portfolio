/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'jzp-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.scss'],
})
export class SocialsComponent implements OnInit, AfterViewInit {
  instagramScript: unknown;
  twitterScript: unknown;

  constructor() {
    // if (this.router.navigated === true) {
    //   location.reload();
    // }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    try {
      this.loadScripts();
    } catch (error) {
      console.debug(error);
    }
    // this.instagramScript.loaded = false;
    // this.twitterScript.loaded = false;
  }

  loadScripts() {
    const scriptEl = document.createElement('script');
    scriptEl.src = 'https://www.instagram.com/embed.js';
    scriptEl.async = true;
    scriptEl.type = 'text/javascript';
    const targeto = document.querySelectorAll<HTMLDivElement>('.insta-posts');
    targeto.forEach((node: HTMLDivElement) => node.append(scriptEl));
  }
}
