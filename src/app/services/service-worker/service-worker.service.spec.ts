import { TestBed } from '@angular/core/testing';

import { ServiceWorkerService } from './service-worker.service';
import { importProvidersFrom } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

describe('ServiceWorkerService', () => {
  let service: ServiceWorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        importProvidersFrom(
          ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: false,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:20000',
          }),
        ),
      ],
    });
    service = TestBed.inject(ServiceWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.swUpdates).toBeDefined();

    expect(service.publicKey).toBe(
      'BHr4Vvr3Uh3dsAj749pPSlkAbe-qknUpEypYYN1xvm9QN_DRzAo80b2gJSLxvui5cjdMB1FPKiGVHbxtj-dFDJQ',
    );
  });

  it('should have a disabled sw update for local build', () => {
    expect(service.swUpdates.isEnabled).toBeFalse();
  });
});
