import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessTabComponent } from './fitness-tab.component';

describe('FitnessTabComponent', () => {
  let component: FitnessTabComponent;
  let fixture: ComponentFixture<FitnessTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FitnessTabComponent],
    });
    fixture = TestBed.createComponent(FitnessTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
