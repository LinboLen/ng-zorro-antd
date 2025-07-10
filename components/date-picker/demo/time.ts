import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: '',
  imports: [FormsModule, TriDatePickerModule],
  template: `
    <tri-date-picker
      showTime
      format="yyyy-MM-dd HH:mm:ss"
      ngModel
      (ngModelChange)="onChange($event)"
      (onOk)="onOk($event)"
    ></tri-date-picker>
    <br />
    <tri-range-picker
      [showTime]="{ nzFormat: 'HH:mm' }"
      format="yyyy-MM-dd HH:mm"
      ngModel
      (ngModelChange)="onChange($event)"
      (onCalendarChange)="onCalendarChange($event)"
      (onOk)="onOk($event)"
    ></tri-range-picker>
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
export class TriDemoDatePickerTimeComponent {
  onChange(result: Date): void {
    console.log('Selected Time: ', result);
  }

  onOk(result: Date | Date[] | null): void {
    console.log('onOk', result);
  }

  onCalendarChange(result: Array<Date | null>): void {
    console.log('onCalendarChange', result);
  }
}
