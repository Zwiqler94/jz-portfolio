import { Component } from '@angular/core';
import {
  MatCard,
  MatCardHeader,
  MatCardContent,
  MatCardImage,
} from '@angular/material/card';

@Component({
  selector: 'app-japanese-tab',
  templateUrl: './japanese-tab.component.html',
  styleUrls: ['./japanese-tab.component.scss'],
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardContent, MatCardImage],
})
export class JapaneseTabComponent {}
