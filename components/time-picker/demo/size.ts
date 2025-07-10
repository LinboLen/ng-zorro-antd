import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: '',
  imports: [FormsModule, TriTimePickerModule],
  template: `
    <tri-time-picker [(ngModel)]="time" size="large"></tri-time-picker>
    <tri-time-picker [(ngModel)]="time"></tri-time-picker>
    <tri-time-picker [(ngModel)]="time" size="small"></tri-time-picker>
  `,
  styles: [
    `
      nz-time-picker {
        margin: 0 8px 12px 0;
      }
    `
  ]
})
export class TriDemoTimePickerSizeComponent {
  time = new Date();
}
