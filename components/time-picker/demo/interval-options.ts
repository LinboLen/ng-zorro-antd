import { Component } from '@angular/core';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-time-picker-interval-options',
  imports: [TriTimePickerModule],
  template: `<tri-time-picker [minuteStep]="15" [secondStep]="10" />`
})
export class TriDemoTimePickerIntervalOptionsComponent {}
