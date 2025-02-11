import { Component, OnInit, Renderer2, inject, input } from '@angular/core';
import { MicrosoftLearnUserProfile } from 'src/app/interfaces/credentials/microsoft/microsoft.interface';
import { SafeHtml } from '@angular/platform-browser';
import credInfo from 'src/assets/credentials/msft_credentials.json';
import { credentials } from 'src/assets/credentials/credly_credentials';
import { Credly } from 'src/app/interfaces/credentials/credly/credly.interface';
import {
  MatCardModule
} from '@angular/material/card';
import { TabComponent } from 'src/app/components/tab/tab.component';

@Component({
  selector: 'jzp-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
  imports: [
    MatCardModule
  ],
})
export class CredentialsComponent extends TabComponent implements OnInit {
  private renderer2 = inject(Renderer2);

  MICROSOFT_LEARN_URL = 'https://learn.microsoft.com/en-us';
  CREDLY_URL: any;
  scriptHtml: SafeHtml | string;
  profile: MicrosoftLearnUserProfile;
  credlyCreds: Credly[];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
    // this.CREDLY_URL = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,
    //  this.sanitizer.bypassSecurityTrustResourceUrl('//cdn.credly.com/assets/utilities/embed.js')
    // );
  }

  ngOnInit(): void {
    this.credlyCreds = credentials.map((val) => {
      val.height = 260;
      val.width = 260;
      val.host = 'https://www.credly.com';
      return val;
    });

    // console.debug(this.credlyCreds)
    const scriptEl = this.renderer2.createElement('script');
    scriptEl.src = 'assets/credentials/credly-embed.js';
    scriptEl.async = true;
    scriptEl.nonce = btoa('cuuutie');
    scriptEl.type = 'text/javascript';
    const targeto = document.body.querySelector(
      '#credential-div',
    ) as HTMLDivElement;

    // this.scriptHtml = this.sanitizer.bypassSecurityTrustHtml(
    //   `<script src="https://cdn.credly.com/assets/utilities/embed.js" type="text/javascript" async></script> <b></b>`
    // )!;

    this.renderer2.appendChild(targeto, scriptEl);

    this.profile = new MicrosoftLearnUserProfile(credInfo);
    console.debug(this.profile);
  }
  readonly tabTitle = input<string>();
}
