import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: '',
  imports: [FormsModule, TriTimePickerModule],
  template: `
    <tri-time-picker [(ngModel)]="time" use12Hours></tri-time-picker>
    <br />
    <br />
    <tri-time-picker [(ngModel)]="time" use12Hours format="h:mm a"></tri-time-picker>
  `
})
export class TriDemoTimePickerUse12HoursComponent {
  time: Date | null = null;
}
