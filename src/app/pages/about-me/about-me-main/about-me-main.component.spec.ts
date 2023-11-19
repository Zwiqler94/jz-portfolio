import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMeMainComponent } from './about-me-main.component';

describe('MainComponent', () => {
  let component: AboutMeMainComponent;
  let fixture: ComponentFixture<AboutMeMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutMeMainComponent],
    });
    fixture = TestBed.createComponent(AboutMeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
