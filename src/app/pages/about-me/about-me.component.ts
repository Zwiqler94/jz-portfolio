/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import {
  Component,
  Input,
} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Tabs } from 'src/app/interfaces/tabs.model';
import { CredentialsComponent } from 'src/app/pages/about-me/credentials/credentials.component';
import { AboutMeMainComponent } from 'src/app/pages/about-me/about-me-main/about-me-main.component';
import { ProjectsComponent } from 'src/app/pages/about-me/projects/projects.component';
import { SkillsComponent } from 'src/app/pages/about-me/skills/skills.component';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
})
export class AboutMeComponent implements Tabs {
  @Input() tabTitle: string;
  // @ViewChild(TabsDirective, { static: true }) appTabs!: TabsDirective;

  private _badgeHeight = '18.75rem';
  private _badgeWidth = '12.5rem';
  private _tabTitleList: string[] = [
    'About Me',
    'Credentials',
    'Skills',
    'Projects',
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // private tabComponentRefList: ComponentRef<JzTabComponent>[] = [];
  public tabComponentList = [
    { component: AboutMeMainComponent, title: 'About Me' },
    { component: CredentialsComponent, title: 'Credentials' },
    { component: SkillsComponent, title: 'Skills' },
    { component: ProjectsComponent, title: 'Projects' },
  ];

  constructor(protected router: Router) {}

  // ngAfterContentInit(): void {
  //   const targeto: HTMLDivElement = document.getElementById(
  //     'creds'
  //   ) as HTMLDivElement;
  //   const scriptEl = document.createElement('script');
  //   scriptEl.src = 'https://cdn.credly.com/assets/utilities/embed.js';
  //   scriptEl.async = true;
  //   scriptEl.type = 'text/javascript';
  //   targeto.appendChild(scriptEl);
  // }

  onTabChange($event: MatTabChangeEvent, router: Router) {
    if ($event.tab.textLabel === 'Credentials') {
      console.log('xxx');
      const scriptEl = document.createElement('script');
      scriptEl.src = 'https://cdn.credly.com/assets/utilities/embed.js';
      scriptEl.async = true;
      scriptEl.type = 'text/javascript';
      const targeto = document.querySelector(
        '#credential-div',
      ) as HTMLDivElement;
      targeto.append(scriptEl);
      router.navigateByUrl('/aboutme')
      
    }
  }

  public get badgeHeight() {
    return this._badgeHeight;
  }
  public set badgeHeight(value) {
    this._badgeHeight = value;
  }

  public get badgeWidth() {
    return this._badgeWidth;
  }
  public set badgeWidth(value) {
    this._badgeWidth = value;
  }

  public get tabTitleList(): string[] {
    return this._tabTitleList;
  }
  public set tabTitleList(value: string[]) {
    this._tabTitleList = value;
  }
}
