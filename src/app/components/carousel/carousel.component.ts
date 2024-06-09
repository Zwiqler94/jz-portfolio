import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [MatCard, MatCardContent],
})
export class CarouselComponent {
  @Input() slides: string[];
  currentSlideIndex = 0;
  currentSlide: string;

  constructor() {
    this.loop();
  }

  loop() {
    let seed = Math.ceil(
      Math.random() * Math.random() * Math.random() * 100000,
    );
    while (seed < 1000 || seed > 10000) {
      if (seed < 1000) {
        seed = Math.ceil(seed * 10000 + seed * 2);
      } else {
        seed = Math.floor(seed / 2 - seed / 4);
      }
    }
    setInterval(() => {
      if (this.slides != null) {
        this.currentSlideIndex =
          this.currentSlideIndex < this.slides.length - 1
            ? this.currentSlideIndex + 1
            : 0;
        this.currentSlide = this.slides[this.currentSlideIndex];
      }
    }, seed);
  }

  onNextClick() {
    if (this.slides != null) {
      this.currentSlideIndex =
        this.currentSlideIndex < this.slides.length - 1
          ? this.currentSlideIndex + 1
          : 0;
      this.currentSlide = this.slides[this.currentSlideIndex];
    }
  }

  onPreviousClick() {
    if (this.slides != null) {
      this.currentSlideIndex =
        this.currentSlideIndex > 0 ? this.currentSlideIndex - 1 : 15;
      this.currentSlide = this.slides[this.currentSlideIndex];
    }
  }
}
