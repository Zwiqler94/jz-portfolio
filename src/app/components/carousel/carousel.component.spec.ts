import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselComponent } from './carousel.component';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  beforeEach(async () => {
    spyOn(window, 'setInterval').and.returnValue(0 as unknown as number);

    await TestBed.configureTestingModule({
      imports: [CarouselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('advances to the next slide', () => {
    fixture.componentRef.setInput('slides', ['first', 'second']);
    component.onNextClick();
    expect(component.currentSlideIndex).toBe(1);
  });

  it('moves backwards through slides', () => {
    fixture.componentRef.setInput('slides', ['first', 'second']);
    component.currentSlideIndex = 1;
    component.onPreviousClick();
    expect(component.currentSlideIndex).toBe(0);
  });
});
