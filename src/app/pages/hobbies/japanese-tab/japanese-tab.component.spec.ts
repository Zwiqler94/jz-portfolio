import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JapaneseTabComponent } from './japanese-tab.component';

describe('JapaneseTabComponent', () => {
  let component: JapaneseTabComponent;
  let fixture: ComponentFixture<JapaneseTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JapaneseTabComponent],
    });
    fixture = TestBed.createComponent(JapaneseTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
