import { Component } from '@angular/core';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'tri-demo-date-picker-disabled',
  imports: [TriDatePickerModule],
  template: `
    <tri-date-picker disabled />
    <br />
    <tri-date-picker mode="month" disabled />
    <br />
    <tri-range-picker disabled />
  `,
  styles: `
    nz-date-picker,
    nz-range-picker {
      margin: 0 8px 12px 0;
    }
  `
})
export class TriDemoDatePickerDisabledComponent {}
