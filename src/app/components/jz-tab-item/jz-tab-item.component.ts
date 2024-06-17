import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
// type TabTypes =
//   | CredentialsComponent
//   | AboutMeMainComponent
//   | ProjectsComponent
//   | SkillsComponent;

@Component({
  selector: 'app-jz-tab-item',
  templateUrl: './jz-tab-item.component.html',
  styleUrls: ['./jz-tab-item.component.scss'],
  standalone: true,
})
export class JzTabItemComponent implements AfterViewInit, OnChanges {
  @Input() tab: any;
  @ViewChild('tabTemplate', { read: ViewContainerRef })
  tabTemplate: ViewContainerRef;

  @Input() tabComponentList: TabNavModel[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const component = this.getComponentFromTabList();
    const componentRef =
      this.tabTemplate.createComponent<typeof component>(component);
    componentRef.instance.tabTitle = this.tab.title;
    this.changeDetector.detectChanges();
  }

  getComponentFromTabList(): any {
    const tabItem = this.tabComponentList.filter((x) => x.link === this.tab)[0];
    return tabItem ? tabItem.component : undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tab']) {
      const component = this.tabComponentList.filter(
        (x) => x.link === this.tab
      )[0].component;

      if (this.tabTemplate) {
        this.tabTemplate.clear();

        const componentRef =
          this.tabTemplate.createComponent<typeof component>(component);

        componentRef.instance.tabTitle = this.tab.title;
      }
    }
  }
}
