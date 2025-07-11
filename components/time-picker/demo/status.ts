import { Component } from '@angular/core';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-time-picker-status',
  imports: [TriTimePickerModule],
  template: `
    <tri-time-picker status="error"></tri-time-picker>
    <br />
    <br />
    <tri-time-picker status="warning">></tri-time-picker>
  `
})
export class TriDemoTimePickerStatusComponent {}
