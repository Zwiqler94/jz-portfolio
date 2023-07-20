/* eslint-disable @typescript-eslint/no-unused-vars */
import { NgModule, inject } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { HobbiesComponent } from './pages/hobbies/hobbies.component';
import { NewsComponent } from './pages/news/news.component';
// import { SocialsComponent } from './pages/socials/socials.component';
import { ErrorPageComponent } from 'src/app/pages/error-page/error-page.component';
// import { FeedComponent } from 'src/app/components/feed/feed.component';
import { MainFeedPageComponent } from 'src/app/pages/main-feed-page/main-feed-page.component';
import { LoginPageComponent } from 'src/app/pages/login-page/login-page.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { SocialsComponent } from 'src/app/pages/socials/socials.component';

const AuthGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).canActivate();
};

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'home', component: MainFeedPageComponent, canActivate: [AuthGuard] },
  { path: 'aboutme', component: AboutMeComponent, canActivate: [AuthGuard] },
  { path: 'hobbies', component: HobbiesComponent, canActivate: [AuthGuard] },
  { path: 'news', component: NewsComponent, canActivate: [AuthGuard] },
  { path: 'socials', component: SocialsComponent },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
