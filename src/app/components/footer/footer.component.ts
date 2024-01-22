import { Component, HostListener, VERSION } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  screenWidth: number;
  screenHeight: number;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    console.log(this.screenHeight, this.screenWidth);
  }

  get angularVersion() {
    return VERSION;
  }
}
