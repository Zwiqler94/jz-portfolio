import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzTabGroupComponent } from './jz-tab-group.component';

describe('JzTabComponent', () => {
  let component: JzTabGroupComponent;
  let fixture: ComponentFixture<JzTabGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JzTabGroupComponent],
    });
    fixture = TestBed.createComponent(JzTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
