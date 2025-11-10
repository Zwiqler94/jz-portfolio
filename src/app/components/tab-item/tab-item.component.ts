import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnChanges,
  SimpleChanges,
  ViewContainerRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
// type TabTypes =
//   | CredentialsComponent
//   | AboutMeMainComponent
//   | ProjectsComponent
//   | SkillsComponent;

@Component({
  selector: 'jzp-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.scss'],
})
export class TabItemComponent implements OnChanges {
  private changeDetector = inject(ChangeDetectorRef);
  private router = inject(Router);

  readonly tab = input<TabNavModel | null>();
  readonly tabTemplate = viewChild.required('tabTemplate', {
    read: ViewContainerRef,
  });

  readonly tabComponentList = input<TabNavModel[]>([]);

  getComponentFromTabList(): TabNavModel | undefined {
    const current = this.tab();
    if (!current) {
      return undefined;
    }
    const tabItem = this.tabComponentList().filter(
      (x) => x.link === current.link,
    )[0];
    return tabItem ? tabItem.component : undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tab']) {
      const activeTab = this.tab();
      const matched = this.tabComponentList().find(
        (x) => x.link === activeTab?.link,
      );
      const tabTemplate = this.tabTemplate();
      if (!matched || !tabTemplate) {
        return;
      }

      tabTemplate.clear();
      const componentRef = tabTemplate.createComponent(matched.component);
      if (
        componentRef.instance &&
        Object.prototype.hasOwnProperty.call(componentRef.instance, 'tabTitle')
      ) {
        (componentRef.instance as { tabTitle?: string }).tabTitle =
          activeTab?.title;
      }
    }
  }
}
