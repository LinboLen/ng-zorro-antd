import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: '',
  imports: [FormsModule, TriTimePickerModule],
  template: `<tri-time-picker [(ngModel)]="time" format="HH:mm"></tri-time-picker>`
})
export class TriDemoTimePickerHideColumnComponent {
  time = new Date();
}
