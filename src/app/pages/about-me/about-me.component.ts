/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Tabs } from 'src/app/interfaces/tabs.model';
import { Router } from '@angular/router';
import { AboutMeMainComponent } from 'src/app/pages/about-me/about-me-main/about-me-main.component';
import { CredentialsComponent } from 'src/app/pages/about-me/credentials/credentials.component';
import { ProjectsComponent } from 'src/app/pages/about-me/projects/projects.component';
import { SkillsComponent } from 'src/app/pages/about-me/skills/skills.component';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
import { JzTabGroupComponent } from '../../components/jz-tab/jz-tab-group.component';
@Component({
    selector: 'app-about-me',
    templateUrl: './about-me.component.html',
    styleUrls: ['./about-me.component.scss'],
    imports: [JzTabGroupComponent]
})
export class AboutMeComponent implements Tabs {
  protected router = inject(Router);

  @Input() tabTitle: string;
  @Input() prevTabTitle: string;
  @Output() tabTitleChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() prevTabTitleChange: EventEmitter<string> =
    new EventEmitter<string>();

  // @ViewChild(TabsDirective, { static: true }) appTabs!: TabsDirective;

  // private _badgeHeight = '18.75rem';
  // private _badgeWidth = '12.5rem';

  private _tabComponentList: TabNavModel[] = [
    { component: AboutMeMainComponent, title: 'About Me', link: 'main' },
    {
      component: CredentialsComponent,
      title: 'Credentials',
      link: 'credentials',
    },
    { component: SkillsComponent, title: 'Skills', link: 'skills' },
    { component: ProjectsComponent, title: 'Projects', link: 'projects' },
  ];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    const currentPagePath = location.pathname.split('/').pop();
    const result = this.tabComponentList.filter(
      (tabItem) => tabItem.link === currentPagePath,
    );
    if (result.length <= 0)
      this.router.navigateByUrl('/aboutme/main', { skipLocationChange: true });
  }

  // public get badgeHeight() {
  //   return this._badgeHeight;
  // }
  // public set badgeHeight(value) {
  //   this._badgeHeight = value;
  // }

  // public get badgeWidth() {
  //   return this._badgeWidth;
  // }
  // public set badgeWidth(value) {
  //   this._badgeWidth = value;
  // }

  public get tabComponentList(): TabNavModel[] {
    return this._tabComponentList;
  }
  public set tabComponentList(value: TabNavModel[]) {
    this._tabComponentList = value;
  }
}
