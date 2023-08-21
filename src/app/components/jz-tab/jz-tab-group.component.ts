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
// type TabTypes =
//   & CredentialsComponent
//   & AboutMeMainComponent
//   & ProjectsComponent
//   & SkillsComponent;

@Component({
  selector: 'app-jz-tab-group',
  templateUrl: './jz-tab-group.component.html',
  styleUrls: ['./jz-tab-group.component.scss'],
})
export class JzTabGroupComponent implements OnInit, Tabs, AfterViewInit, OnChanges {
  @Input() tabTitle = '';
  @Input() router: Router;
  @ViewChild('tabTemplate', { read: ViewContainerRef })
  component: any;
  a = '';

  public tabComponentList: { component: any; title: string }[] = [
    { component: AboutMeMainComponent, title: '' },
    {
      component: CredentialsComponent,
      title: 'credentials',
    },
    { component: SkillsComponent, title: 'skills' },
    { component: ProjectsComponent, title: 'projects' },
  ];

  constructor(private changeDetector: ChangeDetectorRef, public r: ActivatedRoute) {}

  ngOnInit(): void {
    this.r.children[0].url.subscribe((x)=> this.a = x[0].path)
  }

  ngAfterViewInit() {
    // this.loadTabs();

    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['a']) {
       this.component = this.tabComponentList.filter(
        (x) => x.title === this.a
      )[0].component;
    }
  }
}
