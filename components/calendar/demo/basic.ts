import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCalendarMode, TriCalendarModule } from 'ng-zorro-antd/calendar';

@Component({
  selector: '',
  imports: [FormsModule, TriCalendarModule],
  template: `<tri-calendar [(ngModel)]="date" [(modeChange)]="mode" (panelChange)="panelChange($event)"></tri-calendar>`
})
export class TriDemoCalendarBasicComponent {
  date = new Date(2012, 11, 21);
  mode: TriCalendarMode = 'month';

  panelChange(change: { date: Date; mode: string }): void {
    console.log(change.date, change.mode);
  }
}
