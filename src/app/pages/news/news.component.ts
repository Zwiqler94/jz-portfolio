/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { FeedComponent } from '../../components/feed/feed.component';

@Component({
  selector: 'jzp-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  imports: [],
})
export class NewsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
