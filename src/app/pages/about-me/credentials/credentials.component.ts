import { Component, Input, OnInit } from '@angular/core';
import { Tabs } from 'src/app/interfaces/tabs.model';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
})
export class CredentialsComponent extends Tabs implements OnInit {
  ngOnInit(): void {
    console.log('xxx');
    const scriptEl = document.createElement('script');
    scriptEl.src = 'https://cdn.credly.com/assets/utilities/embed.js';
    scriptEl.async = true;
    scriptEl.type = 'text/javascript';
    const targeto = document.querySelector('#credential-div') as HTMLDivElement;
    targeto.append(scriptEl);
  }
  @Input() tabTitle: string;
}
