import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AboutMeComponent } from './home-page.component';
import { TabNavModel } from 'src/app/components/models/tab-nav.model';
import { AboutMeMainComponent } from 'src/app/pages/home-page/about-me/about-me.component';
import { CredentialsComponent } from 'src/app/pages/home-page/credentials/credentials.component';
import { ProjectsComponent } from 'src/app/pages/home-page/projects/projects.component';
import { SkillsComponent } from 'src/app/pages/home-page/skills/skills.component';
import { TabGroupComponent } from 'src/app/components/tab-group/tab-group.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MockAuthService } from 'src/app/testing/mocks';

@Component({
  selector: 'jzp-tab-group',
  standalone: true,
  template: '',
})
class StubTabGroupComponent {
  @Input() tabComponentList: TabNavModel[] = [];
  @Input() currentTab = '';
}

class MockRouter {
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}

describe('AboutMeComponent', () => {
  let fixture: ComponentFixture<AboutMeComponent>;
  let component: AboutMeComponent;
  let router: MockRouter;

  beforeEach(async () => {
    router = new MockRouter();
    await TestBed.configureTestingModule({
      imports: [AboutMeComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useClass: MockAuthService },
      ],
    })
      .overrideComponent(AboutMeComponent, {
        remove: { imports: [TabGroupComponent] },
        add: { imports: [StubTabGroupComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AboutMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component and keeps tab configuration', () => {
    expect(component).toBeTruthy();
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

  it('navigates to main tab when current path is invalid', () => {
    history.replaceState({}, '', '/home');
    router.navigateByUrl.calls.reset();
    component.ngOnInit();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home/main', {
      skipLocationChange: true,
    });
  });

  it('does not redirect when current path matches an existing tab', () => {
    history.replaceState({}, '', '/home/projects');
    router.navigateByUrl.calls.reset();
    component.ngOnInit();
    expect(component.currentPagePath).toBe('projects');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
