import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-form-time-related-controls',
  imports: [ReactiveFormsModule, TriButtonModule, TriDatePickerModule, TriFormModule, TriTimePickerModule],
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label [sm]="8" [xs]="24" required>DatePicker</tri-form-label>
        <tri-form-control [sm]="16" [xs]="24">
          <tri-date-picker formControlName="datePicker" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [sm]="8" [xs]="24" required>DatePicker[ShowTime]</tri-form-label>
        <tri-form-control [sm]="16" [xs]="24">
          <tri-date-picker showTime formControlName="datePickerTime" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [sm]="8" [xs]="24" required>MonthPicker</tri-form-label>
        <tri-form-control [sm]="16" [xs]="24">
          <tri-date-picker mode="month" formControlName="monthPicker" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [sm]="8" [xs]="24" required>RangePicker</tri-form-label>
        <tri-form-control [sm]="16" [xs]="24">
          <tri-range-picker formControlName="rangePicker" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [sm]="8" [xs]="24" required>RangePicker[showTime]</tri-form-label>
        <tri-form-control [sm]="16" [xs]="24">
          <tri-range-picker showTime formControlName="rangePickerTime" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [sm]="8" [xs]="24" required>TimePicker</tri-form-label>
        <tri-form-control [sm]="16" [xs]="24">
          <tri-time-picker formControlName="timePicker" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [xs]="{ span: 24, offset: 0 }" [sm]="{ span: 16, offset: 8 }">
          <button tri-button type="primary">Submit</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  styles: `
    form {
      max-width: 600px;
    }
  `
})
export class TriDemoFormTimeRelatedControlsComponent {
  private fb = inject(FormBuilder);
  validateForm = this.fb.group({
    datePicker: this.fb.control<Date | null>(null),
    datePickerTime: this.fb.control<Date | null>(null),
    monthPicker: this.fb.control<Date | null>(null),
    rangePicker: this.fb.control<[Date, Date] | null>(null),
    rangePickerTime: this.fb.control<[Date, Date] | null>(null),
    timePicker: this.fb.control<Date | null>(null)
  });

  submitForm(): void {
    console.log(this.validateForm.value);
  }
}
