import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatChipsModule } from '@angular/material/chips';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { TabComponent } from 'src/app/components/tab/tab.component';

interface SkillModel {
  skill: string;
  list: string;
}

@Component({
  selector: 'jzp-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  imports: [MatCardModule, MatAccordion, MatExpansionModule, MatChipsModule],
})
export class SkillsComponent extends TabComponent {
  private _skillList: SkillModel[] = [];
  private _skillListDefault: SkillModel[] = [
    { list: 'Cloud', skill: 'AWS' },
    { list: 'Cloud', skill: 'Azure' },
    { list: 'Cloud', skill: 'Google Cloud Platform' },
    { list: 'Cloud', skill: 'Firebase' },
    { list: 'Cloud', skill: 'IBM Cloud' },
    { list: 'Databases', skill: 'IBM Cloudant' },
    { list: 'Databases', skill: 'MongoDB' },
    { list: 'Databases', skill: 'PostgreSQL' },
    { list: 'Designs', skill: 'Angular Material' },
    { list: 'Designs', skill: 'Bootstrap' },
    { list: 'Designs', skill: 'IBM Carbon Design System' },
    { list: 'Frameworks', skill: 'Angular' },
    { list: 'Frameworks', skill: 'Chai' },
    { list: 'Frameworks', skill: 'Express' },
    { list: 'Frameworks', skill: 'Hyperledger Fabric' },
    { list: 'Frameworks', skill: 'Hyperledger Indy' },
    { list: 'Frameworks', skill: 'Mocha' },
    { list: 'Methodologies', skill: 'Agile Software Development' },
    { list: 'Methodologies', skill: 'Test-Driven Development' },
    { list: 'Programming', skill: 'C' },
    { list: 'Programming', skill: 'C++' },
    { list: 'Programming', skill: 'Go' },
    { list: 'Programming', skill: 'Haskell' },
    { list: 'Programming', skill: 'Java' },
    { list: 'Programming', skill: 'JavaScript' },
    { list: 'Programming', skill: 'Node.JS' },
    { list: 'Programming', skill: 'Prolog' },
    { list: 'Programming', skill: 'Python' },
    { list: 'Programming', skill: 'Ruby' },
    { list: 'Programming', skill: 'Typescript' },
    { list: 'Tools', skill: 'Cloud Foundry' },
    { list: 'Tools', skill: 'Docker' },
    { list: 'Tools', skill: 'Git' },
    { list: 'Tools', skill: 'Github' },
    { list: 'Tools', skill: 'Jenkins' },
    { list: 'Tools', skill: 'Jira' },
    { list: 'Tools', skill: 'Kubernetes' },
    { list: 'Frameworks', skill: 'Supertest' },
    { list: 'Tools', skill: 'Swagger/OpenAPI 3' },
  ];

  public get skillList(): SkillModel[] {
    // if (environment.production) {
    //   return this._skillList;
    // } else
    return this._skillList.length <= 0
      ? this._skillListDefault
      : this._skillList;
  }
  public set skillList(value) {
    if (environment.production) {
      this._skillList = value;
    } else this._skillListDefault = value;
  }
}
