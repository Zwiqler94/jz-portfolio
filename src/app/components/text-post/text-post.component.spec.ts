import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPostComponent } from './text-post.component';

describe('TextPostComponent', () => {
  let component: TextPostComponent;
  let fixture: ComponentFixture<TextPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextPostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPostComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', '<p>Test content</p>');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
