import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'jzp-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.scss'],
})
export class SocialsComponent implements AfterViewInit {
  instagramScript: unknown;
  twitterScript: unknown;

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
