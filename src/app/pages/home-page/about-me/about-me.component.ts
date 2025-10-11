import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TabComponent } from 'src/app/components/tab/tab.component';
import { CredentialsComponent } from '../credentials/credentials.component';
import { SkillsComponent } from '../skills/skills.component';

@Component({
  selector: 'jzp-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
  imports: [MatCardModule, CredentialsComponent, SkillsComponent],
})
export class AboutMeMainComponent extends TabComponent {
  cardTitle1 = 'About Me 👋';
  cardTitle2 = 'What I Do  ☁️';
  cardTitle3 = 'Where I Work 💼';
  cardTitle4 = 'Tools I Love 🛠️';
  cardContent1A = "Hi, I'm Jake";
  cardContent1B =
    'I’m a developer passionate about building modern web apps, microservices, and APIs. I thrive on turning \
                ideas into polished, impactful digital solutions using Angular and Angular Material. Outside work, I’m always \
                looking for ways to streamline processes, explore new tech, and keep things innovative.';
  cardContent2 =
    'I specialize in crafting scalable systems using Node.js, Express.js, and Docker. My workflow is rooted \
              in Test-Driven Development (TDD) for rock-solid performance. From designing RESTful APIs to writing clean, \
              developer-friendly OpenAPI 3 docs, I make sure every piece fits together perfectly. Plus, I enjoy refining \
              UI/UX for seamless user experiences.';
  cardContent3 =
    'At IBM, I’m currently working on the Interagency Fuels Treatment Decision Support System (IFTDSS). This \
              project supports wildfire management by helping the Department of the Interior plan and optimize fuel \
              treatments to reduce wildfire risks. It’s a blend of geospatial analysis, cloud computing, and user-friendly design \
              to make impactful decisions easier for stakeholders.';
  cardContent4 =
    'I’m cloud-savvy and love deploying apps with Docker, Kubernetes, and platforms like IBM Cloud and \
              Google Cloud. I’m fluent in both SQL and NoSQL databases (Postgres, MongoDB), and I know my way around \
              tools like Git, \
              Jenkins, and Jira. Whether it’s scaling solutions or optimizing workflows, I’m all about making tech work \
              smarter, not \
              harder.';

  _profileImage = './assets/about-me/me.avif';
  _sideImageA: string = './assets/about-me/side-image-18.avif';
  _sideImageB: string = './assets/about-me/side-image-2.avif';
  _sideImageC: string = './assets/about-me/side-image-3.avif';
  _sideImageD: string = './assets/about-me/side-image-4.avif';
  _sideImageE: string = './assets/about-me/side-image-5.avif';
  _sideImageF: string = './assets/about-me/side-image-6.avif';
  _sideImageG: string = './assets/about-me/side-image-11.avif';
  _sideImageH: string = './assets/about-me/side-image-14.avif';
  _sideImageI: string = './assets/about-me/side-image-16.avif';
  _sideImageJ: string = './assets/about-me/side-image-19.avif';
}
