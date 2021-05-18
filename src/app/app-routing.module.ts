import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { HobbiesComponent } from './hobbies/hobbies.component';
import { NewsComponent } from './news/news.component';
import { SocialsComponent } from './socials/socials.component';
import { ErrorPageComponent } from 'src/app/error-page/error-page.component';
import { FeedComponent } from 'src/app/feed/feed.component';

const routes: Routes = [
  { path: 'aboutme', component: AboutMeComponent },
  { path: 'hobbies', component: HobbiesComponent },
  { path: 'news', component: NewsComponent },
  { path: 'socials', component: SocialsComponent },
  { path: '/', component: FeedComponent },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
