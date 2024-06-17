import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HobbiesComponent } from './hobbies.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { importProvidersFrom } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideRouter } from '@angular/router';

xdescribe('HobbiesComponent', () => {
  let component: HobbiesComponent;
  let fixture: ComponentFixture<HobbiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HobbiesComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideStorage(() => getStorage()),
        importProvidersFrom(
          ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: false,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:20000',
          }),
        ),
        provideRouter([{ path: '**', component: HobbiesComponent }]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HobbiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
