import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewContainerRef,
  computed,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
import { TabItemComponent } from '../tab-item/tab-item.component';

import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { TabComponent } from 'src/app/components/tab/tab.component';

@Component({
  selector: 'jzp-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
  imports: [
    MatTabNav,
    MatTabLink,
    RouterLink,
    MatTabNavPanel,
    TabItemComponent,
  ],
})
export class TabGroupComponent
  extends TabComponent
  implements OnInit, AfterViewInit
{
  private changeDetector = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);

  readonly router = input<Router>();
  component = viewChild('tabTemplate', { read: ViewContainerRef });
  currentTab = model<string>('');
  currentPage = '';

  readonly tabComponentList = input<TabNavModel[]>([]);
  readonly selectedTab = computed(
    () =>
      this.tabComponentList().find((tab) => tab.link === this.currentTab()) ??
      this.tabComponentList()[0] ??
      null,
  );
  routeSubscription: any;

  constructor() {
    super();
  }

  ngOnInit(): void {
    const routeChild = this.route.children[0];
    this.routeSubscription = routeChild?.url.subscribe({
      next: (segments) => {
        const nextLink = segments[0]?.path;
        if (nextLink) {
          this.currentTab.set(nextLink);
        } else if (this.tabComponentList().length) {
          this.currentTab.set(this.tabComponentList()[0].link);
        }
      },
      error: (err) => {
        console.error('Failed to subscribe to route changes:', err);
        this.routeSubscription.unsubscribe();
      },
      complete: () => {
        console.debug('Route subscription completed');
        this.routeSubscription.unsubscribe();
      },
    });

    if (!this.currentTab() && this.tabComponentList().length) {
      this.currentTab.set(this.tabComponentList()[0].link);
    }
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }
}
