import { Component, input } from '@angular/core';

@Component({
  selector: 'jzp-tab',
  imports: [],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent {
  public readonly tabTitle = input<string>();
}
