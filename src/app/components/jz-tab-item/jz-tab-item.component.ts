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
// type TabTypes =
//   | CredentialsComponent
//   | AboutMeMainComponent
//   | ProjectsComponent
//   | SkillsComponent;

@Component({
  selector: 'app-jz-tab-item',
  templateUrl: './jz-tab-item.component.html',
  styleUrls: ['./jz-tab-item.component.scss'],
})
export class JzTabItemComponent implements AfterViewInit, OnChanges {
  @Input() tab: any;
  @ViewChild('tabTemplate', { read: ViewContainerRef })
  tabTemplate: ViewContainerRef;


  @Input() tabComponentList: { component: any; title: string }[] = [];

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void{
     const component = this.tabComponentList.filter(
       (x) => x.title === this.tab
     )[0].component;
     const componentRef =
       this.tabTemplate.createComponent<typeof component>(component);
    componentRef.instance.tabTitle = this.tab.title;
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tab']) {
      this.tabTemplate.clear();
      const component = this.tabComponentList.filter((x) => x.title === this.tab)[0].component;
      const componentRef = this.tabTemplate.createComponent<typeof component>(component);
      componentRef.instance.tabTitle = this.tab.title;
    }
  }
}
