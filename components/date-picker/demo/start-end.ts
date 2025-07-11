import { Component, ViewChild } from '@angular/core';
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
    ></tri-date-picker>
    <tri-date-picker
      #endDatePicker
      [disabledDate]="disabledEndDate"
      showTime
      format="yyyy-MM-dd HH:mm:ss"
      [(ngModel)]="endValue"
      placeHolder="End"
      (onOpenChange)="handleEndOpenChange($event)"
    ></tri-date-picker>
  `,
  styles: [
    `
      nz-date-picker {
        margin: 0 8px 12px 0;
      }
    `
  ]
})
export class TriDemoDatePickerStartEndComponent {
  startValue: Date | null = null;
  endValue: Date | null = null;
  @ViewChild('endDatePicker') endDatePicker!: TriDatePickerComponent;

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
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
