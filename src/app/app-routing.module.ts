import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { HobbiesComponent } from './pages/hobbies/hobbies.component';
import { NewsComponent } from './pages/news/news.component';
import { SocialsComponent } from './pages/socials/socials.component';
import { ErrorPageComponent } from 'src/app/pages/error-page/error-page.component';
import { FeedComponent } from 'src/app/components/feed/feed.component';
import { MainFeedPageComponent } from 'src/app/pages/main-feed-page/main-feed-page.component';

const routes: Routes = [
  { path: 'aboutme', component: AboutMeComponent },
  { path: 'hobbies', component: HobbiesComponent },
  { path: 'news', component: NewsComponent },
  // { path: 'socials', component: SocialsComponent },
  { path: '', component: MainFeedPageComponent },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
