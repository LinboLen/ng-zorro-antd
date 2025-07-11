import { Component } from '@angular/core';

import { TriCalendarModule } from 'ng-zorro-antd/calendar';

@Component({
  selector: 'tri-demo-calendar-card',
  imports: [TriCalendarModule],
  template: `
    <div class="card">
      <tri-calendar
        [fullscreen]="false"
        (selectChange)="onValueChange($event)"
        (panelChange)="onPanelChange($event)"
      ></tri-calendar>
    </div>
  `,
  styles: [
    `
      .card {
        width: 300px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
      }
    `
  ]
})
export class TriDemoCalendarCardComponent {
  onValueChange(value: Date): void {
    console.log(`Current value: ${value}`);
  }

  onPanelChange(change: { date: Date; mode: string }): void {
    console.log(`Current value: ${change.date}`);
    console.log(`Current mode: ${change.mode}`);
  }
}
