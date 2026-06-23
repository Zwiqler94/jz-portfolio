import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabItemComponent } from './tab-item.component';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';

@Component({
  selector: 'jzp-test-tab',
  standalone: true,
  template: '<p class="tab-body">Dynamic Tab</p>',
})
class TestTabComponent {
  tabTitle?: string = '';
}

@Component({
  standalone: true,
  template: `
    <jzp-tab-item [tabComponentList]="tabs" [tab]="activeTab"></jzp-tab-item>
  `,
  imports: [TabItemComponent, TestTabComponent],
})
class HostComponent {
  tabs: TabNavModel[] = [
    { title: 'Main', link: 'main', component: TestTabComponent },
  ];
  activeTab: TabNavModel | null = this.tabs[0];
}

describe('TabItemComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders the component associated with the active tab', () => {
    const body = fixture.debugElement.query(By.css('.tab-body'));
    expect(body).toBeTruthy();
    expect(body.nativeElement.textContent).toContain('Dynamic Tab');
  });

  it('updates the rendered component when the tab changes', () => {
    const host = fixture.componentInstance;
    host.tabs.push({
      title: 'Projects',
      link: 'projects',
      component: TestTabComponent,
    });
    host.activeTab = host.tabs[1];
    fixture.detectChanges();

    const body = fixture.debugElement.query(By.css('.tab-body'));
    expect(body).toBeTruthy();
    const rendered = fixture.debugElement.query(By.directive(TestTabComponent))
      .componentInstance as TestTabComponent;
    expect(rendered.tabTitle).toBe('Projects');
  });

  it('returns undefined when there is no active tab', () => {
    const host = fixture.componentInstance;
    host.activeTab = null;
    fixture.detectChanges();

    const tabItem = fixture.debugElement.query(By.directive(TabItemComponent))
      .componentInstance as TabItemComponent;
    expect(tabItem.getComponentFromTabList()).toBeUndefined();
  });

  it('returns undefined when the active tab is not found in the list', () => {
    const host = fixture.componentInstance;
    host.activeTab = {
      title: 'Missing',
      link: 'missing',
      component: TestTabComponent,
    };
    fixture.detectChanges();

    const tabItem = fixture.debugElement.query(By.directive(TabItemComponent))
      .componentInstance as TabItemComponent;
    expect(tabItem.getComponentFromTabList()).toBeUndefined();
  });
});
