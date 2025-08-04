/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { CanActivateFn, Routes } from '@angular/router';

// import { SocialsComponent } from './pages/socials/socials.component';

// import { FeedComponent } from 'src/app/components/feed/feed.component';

import { AuthService } from 'src/app/services/auth-service/auth.service';

import { environment } from 'src/environments/environment';

import { FitnessTabComponent } from 'src/app/pages/hobbies/fitness-tab/fitness-tab.component';

const AuthGuard: CanActivateFn = (_route, _state) => {
  return inject(AuthService).canActivate();
};

const envAuthGaurd = environment.deployable ? [AuthGuard] : undefined;

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('src/app/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('src/app/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'blog',
    title: 'Welcome to My Site!',
    loadComponent: () =>
      import('src/app/pages/blog-page/blog-page.component').then(
        (m) => m.HomePageComponent,
      ),
    canActivate: envAuthGaurd,
  },
  {
    path: 'home',
    loadComponent: () =>
      import('src/app/pages/home-page/home-page.component').then(
        (m) => m.AboutMeComponent,
      ),
    canActivate: envAuthGaurd,
    children: [
      {
        path: 'main',
        title: 'A little bit about moi!',
        loadComponent: () =>
          import('src/app/pages/home-page/about-me/about-me.component').then(
            (m) => m.AboutMeMainComponent,
          ),
      },
      {
        path: 'projects',
        title: 'Project Portfolio',
        loadComponent: () =>
          import('src/app/pages/home-page/projects/projects.component').then(
            (m) => m.ProjectsComponent,
          ),
      },
      // {
      //   path: 'credentials',
      //   title: 'My Credentials',
      //   loadComponent: () =>
      //     import(
      //       'src/app/pages/home-page/credentials/credentials.component'
      //     ).then((m) => m.CredentialsComponent),
      // },
      // {
      //   path: 'skills',
      //   title: 'What Can I Do?',
      //   loadComponent: () =>
      //     import('src/app/pages/home-page/skills/skills.component').then(
      //       (m) => m.SkillsComponent,
      //     ),
      // },
    ],
  },
  {
    path: 'hobbies',
    loadComponent: () =>
      import('./pages/hobbies/hobbies.component').then(
        (m) => m.HobbiesComponent,
      ),
    canActivate: envAuthGaurd,
    title: 'My Hobbies! 🤪',
    children: [
      {
        path: 'photos',
        title: 'Photos to Pass The Time',
        loadComponent: () =>
          import(
            'src/app/pages/hobbies/photography-tab/photography-tab.component'
          ).then((m) => m.PhotographyTabComponent),
      },
      // { path: 'fitness', component: FitnessTabComponent },
      {
        path: 'japanese',
        title: 'ようこそ！',
        loadComponent: () =>
          import(
            'src/app/pages/hobbies/japanese-tab/japanese-tab.component'
          ).then((m) => m.JapaneseTabComponent),
      },
    ],
  },
  // {
  //   path: 'news',
  //   loadComponent: () =>
  //     import('./pages/news/news.component').then((m) => m.NewsComponent),
  //   title: 'Blog',
  //   canActivate: envAuthGaurd,
  // },
  // {
  //   path: 'socials',
  //   loadComponent: () =>
  //     import('src/app/pages/socials/socials.component').then(
  //       (m) => m.SocialsComponent,
  //     ),
  //   title: 'Socialize With Me',
  //   canActivate: envAuthGaurd,
  // },
  {
    path: 'contact',
    loadComponent: () =>
      import('src/app/pages/contact-me/contact-me/contact-me.component').then(
        (m) => m.ContactMeComponent,
      ),
    title: 'Contact Me',
    canActivate: envAuthGaurd,
  },
  {
    path: 'editor',
    loadComponent: () =>
      import('src/app/pages/editor-page/editor-page.component').then(
        (m) => m.EditorPageComponent,
      ),
    title: 'Manage The Blog!',
    canActivate: envAuthGaurd,
  },
  {
    path: 'error',
    title: "You've Discovered A Problem",
    loadComponent: () =>
      import('src/app/pages/error-page/error-page.component').then(
        (m) => m.ErrorPageComponent,
      ),
  },
  {
    path: '**',
    title: "You've Discovered A Problem",
    loadComponent: () =>
      import('src/app/pages/error-page/error-page.component').then(
        (m) => m.ErrorPageComponent,
      ),
  },
];
