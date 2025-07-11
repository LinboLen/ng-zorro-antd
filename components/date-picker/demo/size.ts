import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriDatePickerModule, TriDatePickerSizeType } from 'ng-zorro-antd/date-picker';
import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-date-picker-size',
  imports: [FormsModule, TriDatePickerModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="size">
      <label tri-radio-button value="large">large</label>
      <label tri-radio-button value="default">default</label>
      <label tri-radio-button value="small">small</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-date-picker [size]="size"></tri-date-picker>
    <br />
    <tri-date-picker mode="week" [size]="size"></tri-date-picker>
    <br />
    <tri-date-picker mode="month" [size]="size"></tri-date-picker>
    <br />
    <tri-date-picker mode="quarter" [size]="size"></tri-date-picker>
    <br />
    <tri-range-picker [size]="size"></tri-range-picker>
  `,
  styles: [
    `
      nz-date-picker,
      nz-range-picker {
        margin: 0 8px 12px 0;
      }
    `
  ]
})
export class TriDemoDatePickerSizeComponent {
  size: TriDatePickerSizeType = 'default';
}
