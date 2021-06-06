import { Component, Input, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';


@Component({
  selector: 'app-text-post',
  templateUrl: './text-post.component.html',
  styleUrls: ['./text-post.component.scss'],
})
export class TextPostComponent implements OnInit {

  @Input() postTitle: string;
  @Input() postContent: string;
  constructor() {
  }

  ngOnInit(): void {
  }

}
