import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBaseComponent } from './post-base.component';

describe('LinkPostComponent', () => {
  let component: PostBaseComponent;
  let fixture: ComponentFixture<PostBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostBaseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
