import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCalendarMode, TriCalendarModule } from 'ng-zorro-antd/calendar';

@Component({
  selector: 'tri-demo-calendar-basic',
  imports: [FormsModule, TriCalendarModule],
  template: `<tri-calendar [(ngModel)]="date" [(modeChange)]="mode" (panelChange)="panelChange($event)" />`
})
export class TriDemoCalendarBasicComponent {
  readonly date = signal(new Date(2012, 11, 21));
  readonly mode = signal<TriCalendarMode>('month');

  panelChange(change: { date: Date; mode: string }): void {
    console.log(change.date, change.mode);
  }
}
