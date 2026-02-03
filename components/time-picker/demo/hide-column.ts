import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-time-picker-hide-column',
  imports: [FormsModule, TriTimePickerModule],
  template: `<tri-time-picker [(ngModel)]="time" format="HH:mm" />`
})
export class TriDemoTimePickerHideColumnComponent {
  time = new Date();
}
