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
import { ActivatedRoute } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';

@Component({
  selector: 'app-jz-tab-group',
  templateUrl: './jz-tab-group.component.html',
  styleUrls: ['./jz-tab-group.component.scss'],
})
export class JzTabGroupComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('tabTemplate', { read: ViewContainerRef })
  component: any;

  currentTab = '';
  previousTab = '';

  @Input() tabComponentList: TabNavModel[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    public route: ActivatedRoute,
  ) {}

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
      this.component = this.tabComponentList.filter(
        (x) => x.link === this.currentTab,
      )[0].component;

      this.previousTab = changes['currentTab'].previousValue;
      console.log({ tab: this.currentTab, prevTab: this.previousTab });
    }
  }
}
