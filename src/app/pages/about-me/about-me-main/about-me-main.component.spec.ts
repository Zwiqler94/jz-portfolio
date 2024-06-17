import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMeMainComponent } from './about-me-main.component';
import { provideRouter } from '@angular/router';

describe('MainComponent', () => {
  let component: AboutMeMainComponent;
  let fixture: ComponentFixture<AboutMeMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: '**', component: AboutMeMainComponent }]),
      ],
      imports: [AboutMeMainComponent],
    });
    fixture = TestBed.createComponent(AboutMeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
