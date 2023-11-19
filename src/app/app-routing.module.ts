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
import { ContactMeComponent } from 'src/app/pages/contact-me/contact-me/contact-me.component';
import { environment } from 'src/environments/environment';
import { AboutMeMainComponent } from 'src/app/pages/about-me/about-me-main/about-me-main.component';
import { SkillsComponent } from 'src/app/pages/about-me/skills/skills.component';
import { CredentialsComponent } from 'src/app/pages/about-me/credentials/credentials.component';
import { ProjectsComponent } from 'src/app/pages/about-me/projects/projects.component';
import { EditorPageComponent } from 'src/app/pages/editor-page/editor-page.component';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AuthGuard: CanActivateFn = (_route, _state) => {
  return inject(AuthService).canActivate();
};

const envAuthGaurd = environment.deployable ? [AuthGuard] : undefined;

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'home', component: MainFeedPageComponent, canActivate: envAuthGaurd },
  {
    path: 'aboutme',
    component: AboutMeComponent,
    canActivate: envAuthGaurd,
    children: [
      { path: 'main', component: AboutMeMainComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'credentials', component: CredentialsComponent },
      { path: 'skills', component: SkillsComponent },
    ],
  },
  { path: 'hobbies', component: HobbiesComponent, canActivate: envAuthGaurd },
  { path: 'news', component: NewsComponent, canActivate: envAuthGaurd },
  { path: 'socials', component: SocialsComponent, canActivate: envAuthGaurd },
  { path: 'contact', component: ContactMeComponent, canActivate: envAuthGaurd },
  { path: 'editor', component: EditorPageComponent, canActivate: envAuthGaurd },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
