import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotographyTabComponent } from './photography-tab.component';
import { importProvidersFrom } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PhotographyTabComponent', () => {
  let component: PhotographyTabComponent;
  let fixture: ComponentFixture<PhotographyTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PhotographyTabComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
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
    fixture = TestBed.createComponent(PhotographyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
