import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: '',
  imports: [FormsModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="radioValue">
      @for (o of options; track o.value) {
        <label tri-radio [value]="o.value">{{ o.label }}</label>
      }
    </tri-radio-group>
    <tri-radio-group [(ngModel)]="radioValue">
      @for (o of options; track o.value) {
        <label tri-radio [value]="o.value">{{ o.label }}</label>
      }
    </tri-radio-group>
    <tri-radio-group [(ngModel)]="radioValue">
      @for (o of options; track o.value) {
        <label tri-radio [value]="o.value">{{ o.label }}</label>
      }
    </tri-radio-group>
  `
})
export class TriDemoRadioRadiogroupOptionsComponent {
  radioValue = 'Apple';
  options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
  ];
}
