import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JapaneseTabComponent } from './japanese-tab.component';
import { importProvidersFrom } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Resource } from 'src/app/interfaces/cloudinary-search.interface';

describe('JapaneseTabComponent', () => {
  let component: JapaneseTabComponent;
  let fixture: ComponentFixture<JapaneseTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JapaneseTabComponent],
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
    fixture = TestBed.createComponent(JapaneseTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create an array of GalleryItems', () => {
    const x: Resource[][] = [
      [{ filename: 'A' } as Resource, { filename: 'Z' } as Resource],
      [{ filename: 'B' } as Resource, { filename: 'X' } as Resource],
      [{ filename: 'C' } as Resource, { filename: 'Y' } as Resource],
    ];
    expect(component.zipImageResults(x)).toEqual([
      { filename: 'A' } as Resource,
      { filename: 'B' } as Resource,
      { filename: 'C' } as Resource,
      { filename: 'Z' } as Resource,
      { filename: 'X' } as Resource,
      { filename: 'Y' } as Resource,
    ]);
  });
});
