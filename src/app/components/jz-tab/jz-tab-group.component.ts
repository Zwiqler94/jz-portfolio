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
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
import { JzTabItemComponent } from '../jz-tab-item/jz-tab-item.component';

import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { TabComponent } from 'src/app/components/tab/tab.component';

@Component({
  selector: 'app-jz-tab-group',
  templateUrl: './jz-tab-group.component.html',
  styleUrls: ['./jz-tab-group.component.scss'],
  imports: [
    MatTabNav,
    MatTabLink,
    RouterLink,
    MatTabNavPanel,
    JzTabItemComponent,
  ],
})
export class JzTabGroupComponent
  extends TabComponent
  implements OnInit, AfterViewInit, OnChanges
{
  private changeDetector = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);

  readonly router = input<Router>();
  component = viewChild('tabTemplate', { read: ViewContainerRef });
  currentTab = '';
  previousTab = '';

  readonly tabComponentList = input<TabNavModel[]>([]);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.route.children[0].url
      .pipe()
      .subscribe((x) => (this.currentTab = x[0].path));
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentTab']) {
      this.component = this.tabComponentList().filter(
        (x) => x.link === this.currentTab,
      )[0].component;

      console.debug(this.currentTab);
    }
  }
}
