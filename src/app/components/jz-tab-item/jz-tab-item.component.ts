import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnChanges,
  Output,
  SimpleChanges,
  ViewContainerRef,
  inject,
  input,
  viewChild,
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
  private changeDetector = inject(ChangeDetectorRef);
  private router = inject(Router);

  readonly tab = input<any>();
  readonly tabTemplate = viewChild.required('tabTemplate', {
    read: ViewContainerRef,
  });

  readonly tabComponentList = input<TabNavModel[]>([]);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngAfterViewInit(): void {
    const component = this.getComponentFromTabList();
    const componentRef =
      this.tabTemplate().createComponent<typeof component>(component);
    componentRef.instance.tabTitle = this.tab().title;
    this.changeDetector.detectChanges();
  }

  getComponentFromTabList(): any {
    const tabItem = this.tabComponentList().filter(
      (x) => x.link === this.tab(),
    )[0];
    return tabItem ? tabItem.component : undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tab']) {
      const component = this.tabComponentList().filter(
        (x) => x.link === this.tab(),
      )[0].component;

      const tabTemplate = this.tabTemplate();
      if (tabTemplate) {
        tabTemplate.clear();

        const componentRef =
          tabTemplate.createComponent<typeof component>(component);

        componentRef.instance.tabTitle = this.tab().title;
      }
    }
  }
}
