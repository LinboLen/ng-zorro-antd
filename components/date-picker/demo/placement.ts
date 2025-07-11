import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriDatePickerModule, TriPlacement } from 'ng-zorro-antd/date-picker';
import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-date-picker-placement',
  imports: [FormsModule, TriDatePickerModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="placement">
      <label tri-radio-button value="bottomLeft">bottomLeft</label>
      <label tri-radio-button value="bottomRight">bottomRight</label>
      <label tri-radio-button value="topLeft">topLeft</label>
      <label tri-radio-button value="topRight">topRight</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-date-picker [placement]="placement"></tri-date-picker>
    <br />
    <tri-range-picker [placement]="placement"></tri-range-picker>
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
export class TriDemoDatePickerPlacementComponent {
  placement: TriPlacement = 'bottomLeft';
}
