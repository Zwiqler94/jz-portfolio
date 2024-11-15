import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let x: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent],
    });
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    x = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the screen size', () => {
    const spyOnResize = spyOn(component, 'onResize');
    window.resizeBy(1000, 1200);
    window.dispatchEvent(new Event('resize'));
    expect(spyOnResize).toHaveBeenCalled();
    // expect(component.screenHeight).toBe(1200)
    // expect(component.screenWidth).toBe(1000);
  });
});
