import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-date-picker-week-number',
  imports: [FormsModule, TriDatePickerModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="showWeekNumber">
      <label tri-radio-button [value]="true">true</label>
      <label tri-radio-button [value]="false">false</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-date-picker [showWeekNumber]="showWeekNumber" />
    <br />
    <tri-range-picker [showWeekNumber]="showWeekNumber" />
  `,
  styles: `
    nz-date-picker,
    nz-range-picker {
      margin: 0 8px 12px 0;
    }
  `
})
export class TriDemoDatePickerWeekNumberComponent {
  showWeekNumber: boolean = false;
}
