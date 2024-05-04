import {
  CSP_NONCE,
  Component,
  Inject,
  Input,
  OnInit,
  Renderer2,
  SecurityContext,
} from '@angular/core';
import { MicrosoftLearnUserProfile } from 'src/app/interfaces/credentials/microsoft/microsoft';
import { Tabs } from 'src/app/interfaces/tabs.model';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import credInfo from 'src/assets/credentials/msft_credentials.json';
import { DOCUMENT } from '@angular/common';
import { credentials } from 'src/assets/credentials/credly_credentials';
import { Credly } from 'src/app/interfaces/credentials/credly/credly';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
})
export class CredentialsComponent extends Tabs implements OnInit {
  MICROSOFT_LEARN_URL = 'https://learn.microsoft.com/en-us';
  CREDLY_URL: any;
  scriptHtml: SafeHtml | string;
  profile: MicrosoftLearnUserProfile;
  credlyCreds: Credly[];

  constructor(
    private sanitizer: DomSanitizer,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private doc: Document,
  ) {
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
    console.log(this.profile);
  }
  @Input() tabTitle: string;
}
