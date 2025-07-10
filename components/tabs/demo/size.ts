import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: '',
  imports: [FormsModule, TriRadioModule, TriTabsModule],
  template: `
    <tri-radio-group [(ngModel)]="size">
      <label tri-radio-button value="small"><span>Small</span></label>
      <label tri-radio-button value="default"><span>Default</span></label>
      <label tri-radio-button value="large"><span>Large</span></label>
    </tri-radio-group>
    <tri-tabs [size]="size">
      @for (tab of tabs; track tab) {
        <tri-tab [title]="'Tab ' + tab">Content of tab {{ tab }}</tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsSizeComponent {
  size: 'large' | 'default' | 'small' = 'small';
  tabs = [1, 2, 3];
}
