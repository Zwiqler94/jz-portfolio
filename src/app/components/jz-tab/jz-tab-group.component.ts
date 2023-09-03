import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Tabs } from 'src/app/interfaces/tabs.model';
import { CredentialsComponent } from 'src/app/pages/about-me/credentials/credentials.component';
import { AboutMeMainComponent } from 'src/app/pages/about-me/about-me-main/about-me-main.component';
import { ProjectsComponent } from 'src/app/pages/about-me/projects/projects.component';
import { SkillsComponent } from 'src/app/pages/about-me/skills/skills.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';

@Component({
  selector: 'app-jz-tab-group',
  templateUrl: './jz-tab-group.component.html',
  styleUrls: ['./jz-tab-group.component.scss'],
})
export class JzTabGroupComponent
  implements OnInit, Tabs, AfterViewInit, OnChanges
{
  @Input() tabTitle = '';
  @Input() router: Router;
  @ViewChild('tabTemplate', { read: ViewContainerRef })
  component: any;
  currentTab = '';

  @Input() tabComponentList: TabNavModel[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.children[0].url.subscribe((x) => (this.currentTab = x[0].path));
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentTab']) {
      this.component = this.tabComponentList.filter(
        (x) => x.link === this.currentTab,
      )[0].component;

      console.log(this.currentTab);
    }
  }
}
