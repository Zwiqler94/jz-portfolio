import { Component, Input } from '@angular/core';
import { Interface } from 'readline';
import { Tabs } from 'src/app/interfaces/tabs.model';

interface SkillModel {
  skill: string;
  list: string;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent extends Tabs {
  @Input() public tabTitle: string;

  private _skillList: SkillModel[] = [
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
    { list: 'Methodologies', skill: 'Agile Software Development' },
    { list: 'Methodologies', skill: 'Test-Driven Development' },
    { list: 'Tools', skill: 'Angular' },
    { list: 'Tools', skill: 'Chai' },
    { list: 'Tools', skill: 'Cloud Foundry' },
    { list: 'Tools', skill: 'Cloudant' },
    { list: 'Tools', skill: 'Docker' },
    { list: 'Tools', skill: 'Express' },
    { list: 'Tools', skill: 'Git' },
    { list: 'Tools', skill: 'Github' },
    { list: 'Tools', skill: 'Hyperledger Fabric' },
    { list: 'Tools', skill: 'Hyperledger Indy' },
    { list: 'Tools', skill: 'IBM Carbon Design System' },
    { list: 'Tools', skill: 'IBM Cloud' },
    { list: 'Tools', skill: 'Jenkins' },
    { list: 'Tools', skill: 'Jira' },
    { list: 'Tools', skill: 'Kubernetes' },
    { list: 'Tools', skill: 'Mocha' },
    { list: 'Tools', skill: 'MongoDB' },
    { list: 'Tools', skill: 'Supertest' },
    { list: 'Tools', skill: 'Swagger/OpenAPI 3' },
  ];
  public get skillList() {
    return this._skillList;
  }
  public set skillList(value) {
    this._skillList = value;
  }
}
