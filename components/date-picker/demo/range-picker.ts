import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { getISOWeek } from 'date-fns';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: '',
  imports: [FormsModule, TriDatePickerModule],
  template: `
    <tri-range-picker [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-range-picker>
    <br />
    <tri-range-picker [showTime]="true" [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-range-picker>
    <br />
    <tri-range-picker mode="week" [(ngModel)]="date" (ngModelChange)="getWeek($event)"></tri-range-picker>
    <br />
    <tri-range-picker mode="month" [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-range-picker>
    <br />
    <tri-range-picker mode="quarter" [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-range-picker>
    <br />
    <tri-range-picker mode="year" [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-range-picker>
  `,
  styles: [
    `
      nz-range-picker {
        margin: 0 8px 12px 0;
      }
    `
  ]
})
export class TriDemoDatePickerRangePickerComponent {
  date = null;

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }

  getWeek(result: Date[]): void {
    console.log('week: ', result.map(getISOWeek));
  }
}
