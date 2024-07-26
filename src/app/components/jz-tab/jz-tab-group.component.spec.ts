import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzTabGroupComponent } from './jz-tab-group.component';
import {
  ActivatedRoute,
  RouterLink,
  UrlSegment,
  provideRouter,
} from '@angular/router';
import { JzTabItemComponent } from 'src/app/components/jz-tab-item/jz-tab-item.component';

xdescribe('JzTabComponent', () => {
  let component: JzTabGroupComponent;
  let fixture: ComponentFixture<JzTabGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JzTabGroupComponent],
      providers: [
        // provideRouter([{ path: '/moop', component: JzTabGroupComponent }]),
      ],
    });
    fixture = TestBed.createComponent(JzTabGroupComponent);
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
    component.router.navigateByUrl('/moop');
    console.log({r:component.route})
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
