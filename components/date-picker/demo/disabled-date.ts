import { Component } from '@angular/core';

import { differenceInCalendarDays, setHours } from 'date-fns';

import { DisabledTimeFn, DisabledTimePartial, TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'tri-demo-date-picker-disabled-date',
  imports: [TriDatePickerModule],
  template: `
    <tri-date-picker
      format="yyyy-MM-dd HH:mm:ss"
      [disabledDate]="disabledDate"
      [disabledTime]="disabledDateTime"
      [showTime]="{ nzDefaultOpenValue: timeDefaultValue }"
    />
    <br />
    <tri-date-picker mode="month" [disabledDate]="disabledDate" />
    <br />
    <tri-date-picker mode="quarter" [disabledDate]="disabledDate" />
    <br />
    <tri-date-picker mode="year" [disabledDate]="disabledDate" />
    <br />
    <tri-range-picker
      [disabledDate]="disabledDate"
      [disabledTime]="disabledRangeTime"
      [showTime]="{ nzHideDisabledOptions: true, nzDefaultOpenValue: timeDefaultValue }"
      format="yyyy-MM-dd HH:mm:ss"
    />
  `,
  styles: `
    nz-date-picker,
    nz-range-picker {
      margin: 0 8px 12px 0;
    }
  `
})
export class TriDemoDatePickerDisabledDateComponent {
  today = new Date();
  timeDefaultValue = setHours(new Date(), 0);

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) > 0;

  disabledDateTime: DisabledTimeFn = () => ({
    nzDisabledHours: () => this.range(0, 24).splice(4, 20),
    nzDisabledMinutes: () => this.range(30, 60),
    nzDisabledSeconds: () => [55, 56]
  });

  disabledRangeTime: DisabledTimeFn = (_value, type?: DisabledTimePartial) => {
    if (type === 'start') {
      return {
        nzDisabledHours: () => this.range(0, 60).splice(4, 20),
        nzDisabledMinutes: () => this.range(30, 60),
        nzDisabledSeconds: () => [55, 56]
      };
    }
    return {
      nzDisabledHours: () => this.range(0, 60).splice(20, 4),
      nzDisabledMinutes: () => this.range(0, 31),
      nzDisabledSeconds: () => [55, 56]
    };
  };
}
