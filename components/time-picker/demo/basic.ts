import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-time-picker-basic',
  imports: [FormsModule, TriTimePickerModule],
  template: `<tri-time-picker [(ngModel)]="time" [defaultOpenValue]="defaultOpenValue" />`
})
export class TriDemoTimePickerBasicComponent {
  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
}
