import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-time-picker-value',
  imports: [FormsModule, TriTimePickerModule],
  template: `<tri-time-picker [(ngModel)]="time"></tri-time-picker>`
})
export class TriDemoTimePickerValueComponent {
  time: Date | null = null;
}
