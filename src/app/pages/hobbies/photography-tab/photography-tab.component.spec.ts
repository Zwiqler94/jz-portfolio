import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotographyTabComponent } from './photography-tab.component';

describe('PhotographyTabComponent', () => {
  let component: PhotographyTabComponent;
  let fixture: ComponentFixture<PhotographyTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotographyTabComponent],
    });
    fixture = TestBed.createComponent(PhotographyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
