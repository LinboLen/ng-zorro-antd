import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { endOfMonth } from 'date-fns';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'tri-demo-date-picker-presetted-ranges',
  imports: [FormsModule, TriDatePickerModule],
  template: `
    <tri-range-picker [ranges]="ranges" ngModel (ngModelChange)="onChange($event)"></tri-range-picker>
    <br />
    <tri-range-picker
      [ranges]="ranges"
      showTime
      format="yyyy/MM/dd HH:mm:ss"
      ngModel
      (ngModelChange)="onChange($event)"
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
export class TriDemoDatePickerPresettedRangesComponent {
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };

  onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }
}
