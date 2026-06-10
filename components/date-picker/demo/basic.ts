import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { getISOWeek } from 'date-fns';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'tri-demo-date-picker-basic',
  imports: [FormsModule, TriDatePickerModule],
  template: `
    <tri-date-picker [(ngModel)]="date" (ngModelChange)="onChange($event)" />
    <br />
    <tri-date-picker mode="week" [(ngModel)]="date" (ngModelChange)="getWeek($event)" />
    <br />
    <tri-date-picker mode="month" [(ngModel)]="date" (ngModelChange)="onChange($event)" />
    <br />
    <tri-date-picker mode="quarter" [(ngModel)]="date" (ngModelChange)="onChange($event)" />
    <br />
    <tri-date-picker mode="year" [(ngModel)]="date" (ngModelChange)="onChange($event)" />
  `,
  styles: `
    nz-date-picker {
      margin: 0 8px 12px 0;
    }
  `
})
export class TriDemoDatePickerBasicComponent {
  readonly date = signal<Date | null>(null);

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result));
  }
}
