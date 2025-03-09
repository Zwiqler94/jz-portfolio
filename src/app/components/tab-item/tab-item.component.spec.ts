import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabItemComponent } from './tab-item.component';
import { provideRouter } from '@angular/router';

xdescribe('JzTabItemComponent', () => {
  let component: TabItemComponent;
  let fixture: ComponentFixture<TabItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabItemComponent],
      providers: [provideRouter([{ path: '**', component: TabItemComponent }])],
    });
    fixture = TestBed.createComponent(TabItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
