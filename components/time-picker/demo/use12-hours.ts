import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-time-picker-use12-hours',
  imports: [FormsModule, TriTimePickerModule],
  template: `
    <tri-time-picker [(ngModel)]="time" use12Hours />
    <br />
    <br />
    <tri-time-picker [(ngModel)]="time" use12Hours format="h:mm a" />
  `
})
export class TriDemoTimePickerUse12HoursComponent {
  time: Date | null = null;
}
