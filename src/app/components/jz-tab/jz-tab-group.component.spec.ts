import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzTabGroupComponent } from './jz-tab-group.component';
import {
  ActivatedRoute,
  RouterLink,
  UrlSegment,
  provideRouter,
} from '@angular/router';
import { Observable, from } from 'rxjs';
import { JapaneseTabComponent } from 'src/app/pages/hobbies/japanese-tab/japanese-tab.component';
import { JzTabItemComponent } from 'src/app/components/jz-tab-item/jz-tab-item.component';

xdescribe('JzTabComponent', () => {
  let component: JzTabGroupComponent;
  let fixture: ComponentFixture<JzTabGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JzTabGroupComponent, JzTabItemComponent, RouterLink],
      providers: [
        provideRouter([{ path: '**', component: JzTabGroupComponent }]),
      ],
    });
    fixture = TestBed.createComponent(JzTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
