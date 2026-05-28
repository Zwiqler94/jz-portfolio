import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NgZone,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
import { TabGroupComponent } from '../../components/tab-group/tab-group.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { TabComponent } from 'src/app/components/tab/tab.component';
import { AboutMeMainComponent } from 'src/app/pages/home-page/about-me/about-me.component';
import { ProjectsComponent } from 'src/app/pages/home-page/projects/projects.component';
import { animate, stagger, svg } from 'animejs';
@Component({
  selector: 'jzp-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [TabGroupComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent
  extends TabComponent
  implements OnInit, AfterViewInit
{
  protected router = inject(Router);
  private auth = inject(AuthService);
  private zone = inject(NgZone);

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
    this.currentPagePath = '/home/main';
    this.router.navigateByUrl('/home/main', { skipLocationChange: true });
  }

  ngOnInit(): void {
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

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      animate(svg.createDrawable('.line'), {
        draw: ['0 0', '0 1', '1 1', '1 0'],
        ease: 'inOutQuad',
        fill: 'none',
        color: 'black',
        stroke: 'black',
        delay: stagger(100),
        loop: true,
        duration: 9000,
      });
    });
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
