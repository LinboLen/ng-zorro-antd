import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: '',
  imports: [FormsModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="radioValue">
      <label tri-radio value="A">A</label>
      <label tri-radio value="B">B</label>
      <label tri-radio value="C">C</label>
      <label tri-radio value="D">D</label>
    </tri-radio-group>
  `
})
export class TriDemoRadioRadiogroupComponent {
  radioValue = 'A';
}
