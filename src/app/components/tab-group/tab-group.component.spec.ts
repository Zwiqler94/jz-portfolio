import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabGroupComponent } from './tab-group.component';
import {
  ActivatedRoute,
  RouterLink,
  UrlSegment,
  provideRouter,
} from '@angular/router';
import { TabItemComponent } from 'src/app/components/tab-item/tab-item.component';

xdescribe('JzTabComponent', () => {
  let component: TabGroupComponent;
  let fixture: ComponentFixture<TabGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabGroupComponent],
      providers: [
        // provideRouter([{ path: '/moop', component: JzTabGroupComponent }]),
      ],
    });
    fixture = TestBed.createComponent(TabGroupComponent);
    component = fixture.componentInstance;
    // const routey = new ActivatedRoute();
    // routey.snapshot.url = [
    //   new UrlSegment('/moose', {}),
    //   new UrlSegment('/moosey', {}),
    // ];
    // // routey.snapshot.children[0].url = [
    // //   new UrlSegment('/moose', {}),
    // //   new UrlSegment('/moosey', {}),
    // // ];
    // component.route.children.push(routey);
    component.router()?.navigateByUrl('/moop');
    console.debug({ r: component.route });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
