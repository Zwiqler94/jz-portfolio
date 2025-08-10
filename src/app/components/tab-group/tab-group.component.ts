import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewContainerRef,
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
  implements OnInit, AfterViewInit, OnChanges
{
  private changeDetector = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);

  readonly router = input<Router>();
  component = viewChild('tabTemplate', { read: ViewContainerRef });
  currentTab = model<string>('');
  currentPage = '';

  readonly tabComponentList = input<TabNavModel[]>([]);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.route.children[0].url.subscribe((x) => this.currentTab.set(x[0].path));
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentTab']) {
      this.component = this.tabComponentList().filter(
        (x) => x.link === this.currentTab(),
      )[0].component;

      console.debug(this.currentTab);
    }
  }
}
