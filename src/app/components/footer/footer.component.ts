import { Component, HostListener, VERSION } from '@angular/core';

import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [MatDivider]
})
export class FooterComponent {
  screenWidth: number;
  screenHeight: number;

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    console.debug(this.screenHeight, this.screenWidth);
  }

  get angularVersion() {
    return VERSION;
  }
}
