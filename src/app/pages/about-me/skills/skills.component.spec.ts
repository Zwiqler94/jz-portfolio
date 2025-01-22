import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsComponent } from './skills.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideAnimations()],
      imports: [SkillsComponent],
    });
    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the skills list', () => {
    const list = [
      { list: 'Cloud', skill: 'AWS' },
      { list: 'Cloud', skill: 'Azure' },
      { list: 'Cloud', skill: 'Google Cloud Platform' },
      { list: 'Cloud', skill: 'IBM Cloud' },
      { list: 'Databases', skill: 'IBM Cloudant' },
      { list: 'Databases', skill: 'MongoDB' },
      { list: 'Databases', skill: 'PostgreSQL' },
      { list: 'Designs', skill: 'Angular Material' },
      { list: 'Designs', skill: 'Bootstrap' },
      { list: 'Designs', skill: 'IBM Carbon Design System' },
      { list: 'Frameworks', skill: 'Angular' },
    ];
    component.skillList = list;
    const spy = spyOnProperty(component, 'skillList', 'get').and.callThrough();

    expect(component.skillList).toBe(list);
  });

  it('should get the skills list from "prod"', () => {
    environment.production = true;
    const list = [
      { list: 'Cloud', skill: 'AWS' },
      { list: 'Cloud', skill: 'Azure' },
      { list: 'Cloud', skill: 'Google Cloud Platform' },
      { list: 'Cloud', skill: 'IBM Cloud' },
      { list: 'Databases', skill: 'IBM Cloudant' },
      { list: 'Databases', skill: 'MongoDB' },
      { list: 'Databases', skill: 'PostgreSQL' },
      { list: 'Designs', skill: 'Angular Material' },
      { list: 'Designs', skill: 'Bootstrap' },
      { list: 'Designs', skill: 'IBM Carbon Design System' },
      { list: 'Frameworks', skill: 'Angular' },
    ];
    component.skillList = list;
    const spy = spyOnProperty(component, 'skillList', 'get').and.callThrough();

    expect(component.skillList).toBe(list);
  });
});
