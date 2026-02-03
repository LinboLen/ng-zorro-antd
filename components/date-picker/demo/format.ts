import { Component } from '@angular/core';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'tri-demo-date-picker-format',
  imports: [TriDatePickerModule],
  template: `
    <tri-date-picker [format]="dateFormat" />
    <br />
    <tri-date-picker mode="month" [format]="monthFormat" />
    <br />
    <tri-date-picker mode="quarter" [format]="quarterFormat" />
    <br />
    <tri-range-picker [format]="dateFormat" />
  `,
  styles: `
    nz-date-picker,
    nz-range-picker {
      margin: 0 8px 12px 0;
    }
  `
})
export class TriDemoDatePickerFormatComponent {
  dateFormat = 'yyyy/MM/dd';
  monthFormat = 'yyyy/MM';
  quarterFormat = 'yyyy/[Q]Q';
}
