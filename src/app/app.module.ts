import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';


import { AppComponent } from './app.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { HobbiesComponent } from './hobbies/hobbies.component';
import { NewsComponent } from './news/news.component';
import { SocialsComponent } from './socials/socials.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FeedComponent } from './feed/feed.component';
import { MainFeedPageComponent } from './main-feed-page/main-feed-page.component';



@NgModule({
  declarations: [
    AppComponent,
    AboutMeComponent,
    HobbiesComponent,
    NewsComponent,
    SocialsComponent,
    ErrorPageComponent,
    FeedComponent,
    MainFeedPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
