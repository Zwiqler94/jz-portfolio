/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.scss'],
})
export class SocialsComponent implements AfterViewInit {
  instagramScript: any;
  twitterScript: any;
  instagramLinks = [
    'CuFzfNmOYSb',
    'ChaUH3brfAD',
    'COaxrRXLFRC',
    'COfyM8UruBc',
    'CsSewVWg4bU',
    'CjCNYfCjNjg',
    'CpLNtg1JbT7',
    'CivD4O1jhPc',
    'C3TE_EHJ1cz',
    'Ck6lT-6vxmE',
    'CRNb0feLOa2',
    'ClDDuTfju-W',
    'CbF8P7ZDoVd',
    'CRwGAdTrxyb',
    'CsPIt-rvzbh',
    'C3RKh28LgUP',
    'Czc2OlXNtYW',
    'CqZAqbup_Y0',
    'Ck6lT-6vxmE',
    'C4mrvEPg4eR',
    'C3Y_cKdrt8Q',
    'CeNOiPsjTC2',
    'CVQZkQIrecH',
    'CRNb0feLOa2',
    'ChSqh81jBjc',
    'CmSXuroLths',
    'CuN__E4ub8b',
    'CmLJQXTrp7m',
    'CSqZcJnA8fw',
    'CeNHSIALdm_',
    'ChsAgd3Dq9W',
    'Ctp0SkQrERp',
    'CYt0egMLcaY',
    'B7pNCVggxCG',
    'COltrzerGOg',
    'CnLLfpCL5cV',
    'CC1cTfKgxo1',
    'Cf-TunKrzh8',
    'CPgah9HrN5T',
    'CgsyQYWDcXW',
  ];

  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private domDocument: any,
    private router: Router,
  ) {
    // if (this.router.navigated === true) {
    //   location.reload();
    // }
  }

  ngAfterViewInit(): void {
    try {
      this.loadScripts();
    } catch (error) {
      console.log(error);
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

  random(): number {
    return Math.random() * Math.PI;
  }
}
