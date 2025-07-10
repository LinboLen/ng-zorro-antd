import { Component } from '@angular/core';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: '',
  imports: [TriTimePickerModule],
  template: `<tri-time-picker disabled></tri-time-picker>`
})
export class TriDemoTimePickerDisabledComponent {}
