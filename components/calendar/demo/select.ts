import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAlertModule } from 'ng-zorro-antd/alert';
import { TriCalendarModule } from 'ng-zorro-antd/calendar';

@Component({
  selector: 'tri-demo-calendar-select',
  imports: [DatePipe, FormsModule, TriAlertModule, TriCalendarModule],
  template: `
    <tri-alert message="Your selected date: {{ selectedValue | date: 'yyyy-MM-dd' }}" />
    <tri-calendar [(ngModel)]="selectedValue" (selectChange)="selectChange($event)" />
  `
})
export class TriDemoCalendarSelectComponent {
  selectedValue = new Date('2017-01-25');

  selectChange(select: Date): void {
    console.log(`Select value: ${select}`);
  }
}
