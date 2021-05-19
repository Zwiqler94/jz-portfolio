import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-post',
  templateUrl: './text-post.component.html',
  styleUrls: ['./text-post.component.scss']
})
export class TextPostComponent implements OnInit {

  currentFeedLocation: String;
  post: Object;

  constructor(private feedLocation: String) {
    this.currentFeedLocation = feedLocation;
    this.post = {title: "Hello", content: "World"};
  }

  ngOnInit(): void {
  }

}
