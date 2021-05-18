import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
 
  @Input() feedLocation: String;
  constructor() {
    this.feedLocation = "main";
   }

  ngOnInit(): void {
  }

}
