import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { getISOWeek } from 'date-fns';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: '',
  imports: [FormsModule, TriDatePickerModule, TriTabsModule],
  template: `
    <tri-tabs>
      <tri-tab title="Default">
        <tri-date-picker inline [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-date-picker>
      </tri-tab>
      <tri-tab title="Week">
        <tri-date-picker inline mode="week" [(ngModel)]="date" (ngModelChange)="getWeek($event)"></tri-date-picker>
      </tri-tab>
      <tri-tab title="Month">
        <tri-date-picker inline mode="month" [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-date-picker>
      </tri-tab>
      <tri-tab title="Quarter">
        <tri-date-picker
          inline
          mode="quarter"
          [(ngModel)]="date"
          (ngModelChange)="onChange($event)"
        ></tri-date-picker>
      </tri-tab>
      <tri-tab title="Year">
        <tri-date-picker inline mode="year" [(ngModel)]="date" (ngModelChange)="onChange($event)"></tri-date-picker>
      </tri-tab>
      <tri-tab title="Range">
        <tri-range-picker inline [(ngModel)]="rangeDate" (ngModelChange)="onChange($event)"></tri-range-picker>
      </tri-tab>
      <tri-tab title="Range Time">
        <tri-range-picker
          inline
          showTime
          [(ngModel)]="rangeDate"
          (ngModelChange)="onChange($event)"
        ></tri-range-picker>
      </tri-tab>
      <tri-tab title="Range Week">
        <tri-range-picker
          inline
          mode="week"
          [(ngModel)]="rangeDate"
          (ngModelChange)="onChange($event)"
        ></tri-range-picker>
      </tri-tab>
      <tri-tab title="Range Month">
        <tri-range-picker
          inline
          mode="month"
          [(ngModel)]="rangeDate"
          (ngModelChange)="onChange($event)"
        ></tri-range-picker>
      </tri-tab>
      <tri-tab title="Range Quarter">
        <tri-range-picker
          inline
          mode="quarter"
          [(ngModel)]="rangeDate"
          (ngModelChange)="onChange($event)"
        ></tri-range-picker>
      </tri-tab>
      <tri-tab title="Range Year">
        <tri-range-picker
          inline
          mode="year"
          [(ngModel)]="rangeDate"
          (ngModelChange)="onChange($event)"
        ></tri-range-picker>
      </tri-tab>
    </tri-tabs>
  `,
  styles: [
    `
      :host ::ng-deep .ant-tabs-tabpane {
        padding: 24px;
        overflow: auto;
      }
    `
  ]
})
export class TriDemoDatePickerInlineComponent {
  date = null;
  rangeDate = null;

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result));
  }
}
