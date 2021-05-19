import { Component, OnInit, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.scss']
})
export class SocialsComponent implements OnInit, AfterViewInit {


  instagramScript: any;
  twitterScript: any;

  constructor(private renderer2: Renderer2, @Inject(DOCUMENT) private _document: any, private router: Router) {
    if(this.router.navigated == true){
      location.reload();
    }
  }


  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    console.log(this._document.body);
    try {
      this.loadScripts();
    } catch (error) {
      console.log(error);
    }
    this.instagramScript.loaded = false;
    this.twitterScript.loaded = false;
  }

  loadScripts() {

    return new Promise((resolve, reject) => {

      this.twitterScript = this.renderer2.createElement("script");
      this.twitterScript.id = "twitter-wjs";
      this.twitterScript.type = "text/javascript";
      this.twitterScript.src = "https://platform.twitter.com/widgets.js";
      this.twitterScript.text = "";
      this.twitterScript.onload = () => {
        this.twitterScript.loaded = true;
        resolve({ success: 'true' });
      }
      this.twitterScript.onerror = () => {
        resolve({ success: 'false' });
      }

      this.instagramScript = this.renderer2.createElement("script");
      this.renderer2.setAttribute(this.instagramScript, "async", "");
      this.instagramScript.type = "text/javascript";
      this.instagramScript.src = "https://www.instagram.com/embed.js";
      this.instagramScript.text = "";
      this.instagramScript.onload = () => {
        this.instagramScript.loaded = true;
        resolve({ success: 'true' });
      }
      this.instagramScript.onerror = () => {
        resolve({ success: 'false' });
      }
      this.renderer2.appendChild(this._document.body, this.instagramScript);
      this.renderer2.appendChild(this._document.body, this.twitterScript);
    }
    )

  }

}
