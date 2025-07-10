import { Component } from '@angular/core';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: '',
  imports: [TriTimePickerModule],
  template: `<tri-time-picker [minuteStep]="15" [secondStep]="10"></tri-time-picker>`
})
export class TriDemoTimePickerIntervalOptionsComponent {}
