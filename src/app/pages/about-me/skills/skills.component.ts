import { Component, Input } from '@angular/core';
import { Tabs } from 'src/app/interfaces/tabs.model';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent extends Tabs {
  @Input() public tabTitle: string;

  private _skillList = [
    'C',
    'C++',
    'Java',
    'JavaScript',
    'Node.JS',
    'Python',
    'Typescript',
    'Go',
    'Ruby',
    'Haskell',
    'Prolog',
  ];
  public get skillList() {
    return this._skillList;
  }
  public set skillList(value) {
    this._skillList = value;
  }
}
