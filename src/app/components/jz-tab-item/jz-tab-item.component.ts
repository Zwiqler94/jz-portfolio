import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
import { AboutMeMainComponent } from 'src/app/pages/about-me/about-me-main/about-me-main.component';
import { CredentialsComponent } from 'src/app/pages/about-me/credentials/credentials.component';
import { ProjectsComponent } from 'src/app/pages/about-me/projects/projects.component';
import { SkillsComponent } from 'src/app/pages/about-me/skills/skills.component';
type TabTypes =
  | CredentialsComponent
  | AboutMeMainComponent
  | ProjectsComponent
  | SkillsComponent;

@Component({
  selector: 'app-jz-tab-item',
  templateUrl: './jz-tab-item.component.html',
  styleUrls: ['./jz-tab-item.component.scss'],
})
export class JzTabItemComponent implements AfterViewInit, OnChanges {
  @Input() tab: string;
  @Output() tabChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() prevTab: string;
  @Output() prevTabChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() tabComponentList: TabNavModel[] = [];

  @ViewChild('tabTemplate', { read: ViewContainerRef })
  tabTemplate: ViewContainerRef;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    const component = this.getComponentFromTabList();
    const componentRef = this.tabTemplate.createComponent<TabTypes>(component);
    componentRef.instance.tabTitle = this.tab;
    componentRef.instance.prevTabTitle = this.tab;
    componentRef.instance.prevTabTitleChange.emit(this.tab);
    componentRef.instance.tabTitleChange.emit(this.tab);
    this.changeDetector.detectChanges();
  }

  getComponentFromTabList(): any {
    const tabItem = this.tabComponentList.filter((x) => x.link === this.tab)[0];
    return tabItem ? tabItem.component : undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      if (changes['tab']) {
        this.tabTemplate.clear();
        const component = this.tabComponentList.filter(
          (x) => x.link === this.tab,
        )[0].component;
        const componentRef =
          this.tabTemplate.createComponent<TabTypes>(component);
        componentRef.instance.tabTitle = this.tab;
        componentRef.instance.tabTitleChange.emit(this.tab);
        componentRef.instance.prevTabTitle = changes['tab'].previousValue;
        componentRef.instance.prevTabTitleChange.emit(
          changes['tab'].previousValue,
        );
      }
    }, 10);
  }
}
