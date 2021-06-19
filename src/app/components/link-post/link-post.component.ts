import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-link-post',
  templateUrl: './link-post.component.html',
  styleUrls: ['./link-post.component.scss']
})
export class LinkPostComponent implements OnInit {
  
  @Input() postTitle: string;
  @Input() postContent: string;
  constructor() { }

  ngOnInit(): void {
    this.getLinkPreview();
  }

  getLinkPreview(){
    let linkArray = this.postContent.match(/^http|https:\/\/www.[a-z]*.[a-z]*$/);
    
  }

}
