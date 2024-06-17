import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzTabItemComponent } from './jz-tab-item.component';
import { provideRouter } from '@angular/router';

xdescribe('JzTabItemComponent', () => {
  let component: JzTabItemComponent;
  let fixture: ComponentFixture<JzTabItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JzTabItemComponent],
      providers: [
        provideRouter([{ path: '**', component: JzTabItemComponent }]),
      ],
    });
    fixture = TestBed.createComponent(JzTabItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
