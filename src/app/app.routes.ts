/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { CanActivateFn, Routes } from '@angular/router';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { HobbiesComponent } from './pages/hobbies/hobbies.component';
import { NewsComponent } from './pages/news/news.component';
// import { SocialsComponent } from './pages/socials/socials.component';
import { ErrorPageComponent } from 'src/app/pages/error-page/error-page.component';
// import { FeedComponent } from 'src/app/components/feed/feed.component';
import { HomePageComponent } from 'src/app/pages/home-page/home-page.component';
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
import { PhotographyTabComponent } from 'src/app/pages/hobbies/photography-tab/photography-tab.component';
import { FitnessTabComponent } from 'src/app/pages/hobbies/fitness-tab/fitness-tab.component';
import { JapaneseTabComponent } from 'src/app/pages/hobbies/japanese-tab/japanese-tab.component';

const AuthGuard: CanActivateFn = (_route, _state) => {
  return inject(AuthService).canActivate();
};

const envAuthGaurd = environment.deployable ? [AuthGuard] : undefined;

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', component: LoginPageComponent },
  { path: 'home', component: HomePageComponent, canActivate: envAuthGaurd },
  {
    path: 'aboutme',
    component: AboutMeComponent,
    // canActivate: envAuthGaurd,
    children: [
      { path: 'main', component: AboutMeMainComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'credentials', component: CredentialsComponent },
      { path: 'skills', component: SkillsComponent },
    ],
  },
  {
    path: 'hobbies',
    component: HobbiesComponent,
    canActivate: envAuthGaurd,
    children: [
      { path: 'photos', component: PhotographyTabComponent },
      { path: 'fitness', component: FitnessTabComponent },
      { path: 'japanese', component: JapaneseTabComponent },
    ],
  },
  { path: 'news', component: NewsComponent, canActivate: envAuthGaurd },
  { path: 'socials', component: SocialsComponent, canActivate: envAuthGaurd },
  { path: 'contact', component: ContactMeComponent, canActivate: envAuthGaurd },
  { path: 'editor', component: EditorPageComponent, canActivate: envAuthGaurd },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', component: ErrorPageComponent },
];
