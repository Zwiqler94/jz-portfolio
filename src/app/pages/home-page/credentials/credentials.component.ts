import { Component, OnInit, Renderer2, inject, input } from '@angular/core';
import {
  Achievement,
  MicrosoftLearnUserProfile,
} from 'src/app/interfaces/credentials/microsoft/microsoft.interface';
import { SafeHtml } from '@angular/platform-browser';
import credInfo from 'src/assets/credentials/msft_credentials.json';
import { credentials } from 'src/assets/credentials/credly_credentials';
import { CredlyCredential } from 'src/app/interfaces/credentials/credly/credly.interface';
import { MatCardModule } from '@angular/material/card';
import { TabComponent } from 'src/app/components/tab/tab.component';
import { LearningCredential } from 'src/app/interfaces/credentials/credential.interface';

@Component({
  selector: 'jzp-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
  imports: [MatCardModule],
})
export class CredentialsComponent extends TabComponent implements OnInit {
  private renderer2 = inject(Renderer2);
  readonly tabTitle = input<string>();

  MICROSOFT_LEARN_URL = 'https://learn.microsoft.com/en-us';
  CREDLY_URL: any;
  scriptHtml: SafeHtml | string;
  profile: MicrosoftLearnUserProfile;
  credlyCreds: CredlyCredential[];
  creds: LearningCredential[] = [];

  constructor() {
    super();
    // this.CREDLY_URL = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,
    //  this.sanitizer.bypassSecurityTrustResourceUrl('//cdn.credly.com/assets/utilities/embed.js')
    // );
  }

  ngOnInit(): void {
    credentials.forEach((val) => {
      val.height = 100;
      val.width = 100;
      val.host = 'https://www.credly.com';
      this.creds.push({
        credentialMsft: undefined,
        credentialCredly: val,
        type: 'CRDLY',
      });
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

    this.renderer2.appendChild(targeto, scriptEl);

    this.profile = new MicrosoftLearnUserProfile(credInfo);
    this.profile.xp.achievements.forEach((a) => {
      this.creds.push({
        credentialMsft: a,
        credentialCredly: undefined,
        type: 'MSFT',
      });
    });
    console.log({ hmm: this.creds });
  }
}
