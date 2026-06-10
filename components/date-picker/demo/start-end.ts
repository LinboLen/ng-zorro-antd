import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriDatePickerComponent, TriDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'tri-demo-date-picker-start-end',
  imports: [FormsModule, TriDatePickerModule],
  template: `
    <tri-date-picker
      [disabledDate]="disabledStartDate"
      showTime
      format="yyyy-MM-dd HH:mm:ss"
      [(ngModel)]="startValue"
      placeHolder="Start"
      (onOpenChange)="handleStartOpenChange($event)"
    />
    <tri-date-picker
      #endDatePicker
      [disabledDate]="disabledEndDate"
      showTime
      format="yyyy-MM-dd HH:mm:ss"
      [(ngModel)]="endValue"
      placeHolder="End"
      (onOpenChange)="handleEndOpenChange($event)"
    />
  `,
  styles: `
    nz-date-picker {
      margin: 0 8px 12px 0;
    }
  `
})
export class TriDemoDatePickerStartEndComponent {
  readonly startValue = signal<Date | null>(null);
  readonly endValue = signal<Date | null>(null);

  @ViewChild('endDatePicker') endDatePicker!: TriDatePickerComponent;

  readonly disabledStartDate = (startValue: Date): boolean => {
    const endValue = this.endValue();
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.getTime() > endValue.getTime();
  };

  readonly disabledEndDate = (endValue: Date): boolean => {
    const startValue = this.startValue();
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.getTime() <= startValue.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker._open();
    }
    console.log('handleStartOpenChange', open);
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }
}
