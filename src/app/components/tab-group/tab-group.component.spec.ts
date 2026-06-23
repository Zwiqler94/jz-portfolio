import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';

import { TabGroupComponent } from './tab-group.component';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
import { TabItemComponent } from 'src/app/components/tab-item/tab-item.component';

@Component({
  selector: 'jzp-tab-item',
  standalone: true,
  template: '',
})
class StubTabItemComponent {
  @Input() tabComponentList: TabNavModel[] = [];
  @Input() tab: TabNavModel | null = null;
}

describe('TabGroupComponent', () => {
  let component: TabGroupComponent;
  let fixture: ComponentFixture<TabGroupComponent>;
  let routeSubject: Subject<UrlSegment[]>;

  const tabs: TabNavModel[] = [
    { title: 'Main', link: 'main', component: StubTabItemComponent },
    { title: 'Projects', link: 'projects', component: StubTabItemComponent },
  ];

  beforeEach(async () => {
    routeSubject = new Subject<UrlSegment[]>();
    await TestBed.configureTestingModule({
      imports: [TabGroupComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            children: [{ url: routeSubject.asObservable() }],
          },
        },
      ],
    })
      .overrideComponent(TabGroupComponent, {
        remove: { imports: [TabItemComponent] },
        add: { imports: [StubTabItemComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TabGroupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tabComponentList', tabs);
    routeSubject.next([new UrlSegment('main', {})]);
    fixture.detectChanges();
  });

  it('selects the route-provided tab by default', () => {
    expect(component.currentTab()).toBe('main');
    const links = fixture.debugElement.queryAll(By.css('a[mat-tab-link]'));
    expect(links.length).toBe(2);
    expect(links[0].nativeElement.textContent.trim()).toBe('Main');
  });

  it('updates current tab when a nav item is clicked', () => {
    const links = fixture.debugElement.queryAll(By.css('a[mat-tab-link]'));
    links[1].triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.currentTab()).toBe('projects');
    const stubInstance = fixture.debugElement.query(
      By.directive(StubTabItemComponent),
    ).componentInstance as StubTabItemComponent;
    expect(stubInstance.tab?.link).toBe('projects');
  });

  it('falls back to the first tab when the route has no path segments', () => {
    routeSubject.next([]);
    fixture.detectChanges();

    expect(component.currentTab()).toBe('main');
  });

  it('selects the first tab if no activated child routes exist', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TabGroupComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            children: [],
          },
        },
      ],
    })
      .overrideComponent(TabGroupComponent, {
        remove: { imports: [TabItemComponent] },
        add: { imports: [StubTabItemComponent] },
      })
      .compileComponents();

    const fallbackFixture = TestBed.createComponent(TabGroupComponent);
    fallbackFixture.componentRef.setInput('tabComponentList', tabs);
    fallbackFixture.detectChanges();

    expect(fallbackFixture.componentInstance.currentTab()).toBe('main');
  });
});
