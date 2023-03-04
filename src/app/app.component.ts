import { Component, OnInit } from '@angular/core';
import { ServiceWorkerService } from 'src/app/services/service-worker/service-worker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'jz-portfolio';
  constructor(private serviceWorker: ServiceWorkerService) {}
}
