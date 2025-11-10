import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { HobbiesComponent } from './hobbies.component';
import { Storage } from '@angular/fire/storage';
import { ServiceWorkerService } from 'src/app/services/service-worker/service-worker.service';

class MockRouter {
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}

describe('HobbiesComponent', () => {
  let fixture: ComponentFixture<HobbiesComponent>;
  let router: MockRouter;

  beforeEach(async () => {
    router = new MockRouter();
await TestBed.configureTestingModule({
  imports: [HobbiesComponent],
  providers: [
    { provide: Router, useValue: router },
    { provide: Storage, useValue: {} },
    { provide: ServiceWorkerService, useValue: {} },
    {
      provide: ActivatedRoute,
      useValue: {
        children: [{ url: of([]) }],
      },
    },
  ],
})
  .overrideComponent(HobbiesComponent, { set: { template: '' } })
  .compileComponents();
  });

  it('redirects to photos when the current path is invalid', () => {
    window.history.replaceState({}, '', '/hobbies/invalid');
    fixture = TestBed.createComponent(HobbiesComponent);
    fixture.detectChanges();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/hobbies/photos', {
      skipLocationChange: true,
    });
  });

  it('keeps existing route when it matches a tab', () => {
    window.history.replaceState({}, '', '/hobbies/japanese');
    fixture = TestBed.createComponent(HobbiesComponent);
    fixture.detectChanges();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
