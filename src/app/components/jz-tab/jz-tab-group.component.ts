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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
import { JzTabItemComponent } from '../jz-tab-item/jz-tab-item.component';

import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-jz-tab-group',
  templateUrl: './jz-tab-group.component.html',
  styleUrls: ['./jz-tab-group.component.scss'],
  standalone: true,
  imports: [
    MatTabNav,
    MatTabLink,
    RouterLink,
    MatTabNavPanel,
    JzTabItemComponent,
  ],
})
export class JzTabGroupComponent
  implements OnInit, Tabs, AfterViewInit, OnChanges
{
  @Input() tabTitle = '';
  @Input() router: Router;
  @ViewChild('tabTemplate', { read: ViewContainerRef })
  component: any;
  currentTab = '';
  currentPage = '';

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

      console.debug(this.currentTab);
    }
  }
}
