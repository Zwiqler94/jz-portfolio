import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { problemImage } from 'src/assets/misc';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  @Input() slides: any[];
  currentSlideIndex = 0;
  currentSlide = problemImage;

  constructor() {
    this.loop();
  }

  ngOnInit(): void {
  }

  loop() {
    setInterval(() => {
      this.currentSlideIndex = this.currentSlideIndex < this.slides.length - 1 ? this.currentSlideIndex + 1 : 0;
      this.currentSlide = this.slides[this.currentSlideIndex];
    }, 3000);
  }

  onNextClick() {
    this.currentSlideIndex = this.currentSlideIndex < this.slides.length - 1 ? this.currentSlideIndex + 1 : 0;
    this.currentSlide = this.slides[this.currentSlideIndex];
  }

  onPreviousClick() {
    this.currentSlideIndex = this.currentSlideIndex > 0 ? this.currentSlideIndex - 1 : 15;
    this.currentSlide = this.slides[this.currentSlideIndex];
  }

}
