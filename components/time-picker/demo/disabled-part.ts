import { Component } from '@angular/core';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: '',
  imports: [TriTimePickerModule],
  template: `
    <tri-time-picker
      [disabledHours]="disabledHours"
      [disabledMinutes]="disabledMinutes"
      [disabledSeconds]="disabledSeconds"
    ></tri-time-picker>
  `
})
export class TriDemoTimePickerDisabledPartComponent {
  disabledHours(): number[] {
    return [1, 2, 3];
  }

  disabledMinutes(hour: number): number[] {
    if (hour === 4) {
      return [20, 21, 22, 23, 24, 25];
    } else {
      return [];
    }
  }

  disabledSeconds(hour: number, minute: number): number[] {
    if (hour === 5 && minute === 1) {
      return [20, 21, 22, 23, 24, 25];
    } else {
      return [];
    }
  }
}
