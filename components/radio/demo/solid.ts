import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: '',
  imports: [FormsModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="radioValue" buttonStyle="solid">
      <label tri-radio-button value="A">Hangzhou</label>
      <label tri-radio-button value="B">Shanghai</label>
      <label tri-radio-button value="C">Beijing</label>
      <label tri-radio-button value="D">Chengdu</label>
    </tri-radio-group>
  `
})
export class TriDemoRadioSolidComponent {
  radioValue = 'A';
}
