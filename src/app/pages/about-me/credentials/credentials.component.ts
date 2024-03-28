import { Component, Input, OnInit } from '@angular/core';
import { MicrosoftLearnUserProfile } from 'src/app/interfaces/microsoft/microsoft';
import { Tabs } from 'src/app/interfaces/tabs.model';
import credInfo from 'src/assets/credentials/msft_credentials.json';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
})
export class CredentialsComponent extends Tabs implements OnInit {
  MICROSOFT_LEARN_URL = 'https://learn.microsoft.com/en-us';
  profile: MicrosoftLearnUserProfile;

  ngOnInit(): void {
    const scriptEl = document.createElement('script');
    scriptEl.src = 'https://cdn.credly.com/assets/utilities/embed.js';
    scriptEl.async = true;
    scriptEl.type = 'text/javascript';
    const targeto = document.querySelector('#credential-div') as HTMLDivElement;
    targeto.append(scriptEl);

    this.profile = new MicrosoftLearnUserProfile(credInfo);
    console.log(this.profile);
  }
  @Input() tabTitle: string;
}
