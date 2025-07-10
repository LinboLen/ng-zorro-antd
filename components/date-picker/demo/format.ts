import { Component } from '@angular/core';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: '',
  imports: [TriDatePickerModule],
  template: `
    <tri-date-picker [format]="dateFormat"></tri-date-picker>
    <br />
    <tri-date-picker mode="month" [format]="monthFormat"></tri-date-picker>
    <br />
    <tri-date-picker mode="quarter" [format]="quarterFormat"></tri-date-picker>
    <br />
    <tri-range-picker [format]="dateFormat"></tri-range-picker>
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
export class TriDemoDatePickerFormatComponent {
  dateFormat = 'yyyy/MM/dd';
  monthFormat = 'yyyy/MM';
  quarterFormat = 'yyyy/[Q]Q';
}
