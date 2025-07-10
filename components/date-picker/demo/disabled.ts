import { Component } from '@angular/core';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: '',
  imports: [TriDatePickerModule],
  template: `
    <tri-date-picker disabled></tri-date-picker>
    <br />
    <tri-date-picker mode="month" disabled></tri-date-picker>
    <br />
    <tri-range-picker disabled></tri-range-picker>
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
export class TriDemoDatePickerDisabledComponent {}
