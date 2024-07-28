import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { MicrosoftLearnUserProfile } from 'src/app/interfaces/credentials/microsoft/microsoft.interface';
import { Tabs } from 'src/app/interfaces/tabs.model';
import { SafeHtml } from '@angular/platform-browser';
import credInfo from 'src/assets/credentials/msft_credentials.json';
import { credentials } from 'src/assets/credentials/credly_credentials';
import { Credly } from 'src/app/interfaces/credentials/credly/credly.interface';
import {
  MatCard,
  MatCardContent,
  MatCardImage,
  MatCardSubtitle,
  MatCardFooter,
} from '@angular/material/card';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardImage,
    MatCardSubtitle,
    MatCardFooter,
  ],
})
export class CredentialsComponent extends Tabs implements OnInit {
  MICROSOFT_LEARN_URL = 'https://learn.microsoft.com/en-us';
  CREDLY_URL: any;
  scriptHtml: SafeHtml | string;
  profile: MicrosoftLearnUserProfile;
  credlyCreds: Credly[];

  constructor(private renderer2: Renderer2) {
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
  @Input() tabTitle: string;
}
