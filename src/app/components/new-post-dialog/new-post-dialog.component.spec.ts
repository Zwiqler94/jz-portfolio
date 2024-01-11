import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPostDialogComponent } from './new-post-dialog.component';

describe('NewPostDialogComponent', () => {
  let component: NewPostDialogComponent;
  let fixture: ComponentFixture<NewPostDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewPostDialogComponent],
    });
    fixture = TestBed.createComponent(NewPostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
