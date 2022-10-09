import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPostComponent } from './link-post.component';

describe('LinkPostComponent', () => {
  let component: LinkPostComponent;
  let fixture: ComponentFixture<LinkPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
