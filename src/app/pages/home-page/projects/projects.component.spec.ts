/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MockAuthService } from 'src/app/testing/mocks';
import {
  AgeByNameComponent,
  NasaComponent,
  PokemonComponent,
  UsernameGeneratorComponent,
} from '@zwiqler94/everything-lib';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'lib-username-generator',
  standalone: true,
  template: '',
})
class MockUsernameGeneratorComponent {
  @Input() usernameForm: unknown;
  @Output() usernameFormChange = new EventEmitter<unknown>();
  @Input() result: unknown;
  @Output() resultChange = new EventEmitter<unknown>();
  @Output() completionMsgChange = new EventEmitter<string>();
}

@Component({
  selector: 'lib-pokemon',
  standalone: true,
  template: '',
})
class MockPokemonComponent {
  @Input() heightInput?: string;
  @Input() widthInput?: string;
  @Output() completionMsgChange = new EventEmitter<string>();
}

@Component({
  selector: 'lib-nasa',
  standalone: true,
  template: '',
})
class MockNasaComponent {
  @Input() apiKey?: string;
  @Output() completionMsgChange = new EventEmitter<string>();
}

@Component({
  selector: 'lib-age-by-name',
  standalone: true,
  template: '',
})
class MockAgeByNameComponent {
  @Input() heightInput?: string;
  @Input() widthInput?: string;
  @Output() completionMsgChange = new EventEmitter<string>();
}

class MockSnackBar {
  open = jasmine.createSpy('open');
}

@Injectable()
class MockProjectsAuthService extends MockAuthService {
  override appCheckToken = 'cached-token';
}

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let snackBar: MockSnackBar;

  beforeEach(() => {
    snackBar = new MockSnackBar();

    TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: AuthService, useClass: MockProjectsAuthService },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    });
    TestBed.overrideProvider(MatSnackBar, { useValue: snackBar });
    TestBed.overrideComponent(ProjectsComponent, {
      remove: {
        imports: [
          UsernameGeneratorComponent,
          PokemonComponent,
          NasaComponent,
          AgeByNameComponent,
        ],
      },
      add: {
        imports: [
          MockUsernameGeneratorComponent,
          MockPokemonComponent,
          MockNasaComponent,
          MockAgeByNameComponent,
        ],
      },
    });
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates layout dimensions on resize', () => {
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1200);
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(900);

    component.onResize();

    expect(component.screenWidth).toBe(1200);
    expect(component.screenHeight).toBe(900);
    expect(component.maxWidth).toBe('1130px');
    expect(component.maxHeight).toBe('109.375px');
  });

  it('exposes username form with auth token fallback', () => {
    const form = component.usernameFormInApp();
    expect(form.value.appCheckToken).toBe('cached-token');
  });

  it('emits error snack when completion message is not success', () => {
    component.onCompletionMsgChange('Failure');
    expect(snackBar.open).toHaveBeenCalledWith('Failure', 'X', {
      panelClass: '.error',
    });
  });

  it('does not open snack bar when completion message is success', () => {
    snackBar.open.calls.reset();

    component.onCompletionMsgChange('Success');

    expect(snackBar.open).not.toHaveBeenCalled();
  });

  it('returns NASA API key from environment', () => {
    expect(component.nasaApiKey).toBe(environment.nasaAPIKey);
  });
});
