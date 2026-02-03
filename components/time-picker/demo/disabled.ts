import { Component } from '@angular/core';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-time-picker-disabled',
  imports: [TriTimePickerModule],
  template: `<tri-time-picker disabled />`
})
export class TriDemoTimePickerDisabledComponent {}
