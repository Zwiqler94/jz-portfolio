import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { VersionReadyEvent } from '@angular/service-worker';

import { AppComponent, RELOAD_DOCUMENT } from './app.component';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { AppCheck } from '@angular/fire/app-check';
import { Auth } from '@angular/fire/auth';
import { DatabaseService } from 'src/app/services/database/database.service';
import { DOCUMENT } from '@angular/common';

class MockSwUpdate {
  isEnabled = true;
  versionUpdates = new Subject<VersionReadyEvent>();
  unrecoverable = new Subject<{ reason: string }>();
}

class MockSnackBar {
  open = jasmine.createSpy('open').and.callFake(() => ({
    afterDismissed: () => of({ dismissedByAction: true }),
  }));
}

class MockAuthService {
  appCheckToken?: string;
  logout = jasmine.createSpy('logout');
  getAppCheckToken = jasmine
    .createSpy('getAppCheckToken')
    .and.resolveTo({ token: 'abc' });
}

class MockDatabaseService {
  appCheck?: AppCheck;
}

describe('AppComponent', () => {
  let mockSwUpdate: MockSwUpdate;
  let snackBar: MockSnackBar;
  let reloadSpy: jasmine.Spy;

  beforeEach(async () => {
    mockSwUpdate = new MockSwUpdate();
    snackBar = new MockSnackBar();
    reloadSpy = jasmine.createSpy('reload');

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: SwUpdate, useValue: mockSwUpdate },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: AuthService, useClass: MockAuthService },
        { provide: DatabaseService, useClass: MockDatabaseService },
        { provide: AppCheck, useValue: {} },
        { provide: Auth, useValue: {} },
        { provide: RELOAD_DOCUMENT, useValue: reloadSpy },
      ],
    })
      .overrideComponent(AppComponent, { set: { template: '<div></div>' } })
      .compileComponents();
  });

  it('opens a snack prompting for updates when a new version arrives', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    mockSwUpdate.versionUpdates.next({
      type: 'VERSION_READY',
    } as VersionReadyEvent);
    expect(snackBar.open).toHaveBeenCalledWith(
      'New App Version Detected, Update?',
      'Yup!',
    );
  });

  it('triggers reload when unrecoverable error occurs', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    mockSwUpdate.unrecoverable.next({ reason: 'boom' });
    expect(snackBar.open).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();
  });
});
