import { Component } from '@angular/core';

import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-time-picker-confirmation',
  imports: [TriTimePickerModule],
  template: ` <tri-time-picker needConfirm />`
})
export class TriDemoTimePickerConfirmationComponent {}
