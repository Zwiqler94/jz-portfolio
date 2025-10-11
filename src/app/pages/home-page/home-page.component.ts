import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
import { TabGroupComponent } from '../../components/tab-group/tab-group.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { TabComponent } from 'src/app/components/tab/tab.component';
import { AboutMeMainComponent } from 'src/app/pages/home-page/about-me/about-me.component';
import { CredentialsComponent } from 'src/app/pages/home-page/credentials/credentials.component';
import { ProjectsComponent } from 'src/app/pages/home-page/projects/projects.component';
import { SkillsComponent } from 'src/app/pages/home-page/skills/skills.component';
@Component({
  selector: 'jzp-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [TabGroupComponent],
})
export class AboutMeComponent extends TabComponent {
  protected router = inject(Router);
  private auth = inject(AuthService);

  private _tabComponentList: TabNavModel[] = [
    { component: AboutMeMainComponent, title: 'About Me', link: 'main' },
    // {
    //   component: CredentialsComponent,
    //   title: 'Credentials',
    //   link: 'credentials',
    // },
    // { component: SkillsComponent, title: 'Skills', link: 'skills' },
    { component: ProjectsComponent, title: 'Projects', link: 'projects' },
  ];
  currentPagePath = '';

  constructor() {
    super();
    this.currentPagePath = location.pathname.split('/').pop() ?? '';
    console.log({ page: this.currentPagePath });
    const result = this.tabComponentList.filter(
      (tabItem) => tabItem.link === this.currentPagePath,
    );
    if (result.length == 0 || this.currentPagePath === 'home') {
      this.router.navigateByUrl('/home/main', { skipLocationChange: true });
      this.currentPagePath = '/home/main';
    }
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
