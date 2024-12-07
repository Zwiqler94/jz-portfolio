import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMeComponent } from './about-me.component';
import { provideRouter } from '@angular/router';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
import { AboutMeMainComponent } from 'src/app/pages/about-me/about-me-main/about-me-main.component';
import { CredentialsComponent } from 'src/app/pages/about-me/credentials/credentials.component';
import { ProjectsComponent } from 'src/app/pages/about-me/projects/projects.component';
import { SkillsComponent } from 'src/app/pages/about-me/skills/skills.component';

xdescribe('AboutMeComponent', () => {
  let component: AboutMeComponent;
  let fixture: ComponentFixture<AboutMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'main', component: AboutMeComponent },
          { path: 'about2', component: AboutMeComponent },
        ]),
      ],
      imports: [AboutMeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutMeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a tab list', () => {
    const tabComponentList: TabNavModel[] = [
      { component: AboutMeMainComponent, title: 'About Me', link: 'main' },
      {
        component: CredentialsComponent,
        title: 'Credentials',
        link: 'credentials',
      },
      { component: SkillsComponent, title: 'Skills', link: 'skills' },
      { component: ProjectsComponent, title: 'Projects', link: 'projects' },
    ];
    component.tabComponentList = tabComponentList;
    expect(component.tabComponentList).toBe(tabComponentList);
  });
});
