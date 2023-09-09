import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzTabItemComponent } from './jz-tab-item.component';

describe('JzTabItemComponent', () => {
  let component: JzTabItemComponent;
  let fixture: ComponentFixture<JzTabItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JzTabItemComponent],
    });
    fixture = TestBed.createComponent(JzTabItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
