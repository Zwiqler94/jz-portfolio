/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { PostBaseComponent } from 'src/app/components/post-base/post-base.component';

@Component({
  selector: 'app-text-post',
  templateUrl: './text-post.component.html',
  styleUrls: ['./text-post.component.scss'],
})
export class TextPostComponent extends PostBaseComponent implements OnInit {
  ngOnInit(): void {}
}
