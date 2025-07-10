import { Component } from '@angular/core';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: '',
  imports: [TriDatePickerModule, TriSpaceModule],
  template: `
    <tri-space direction="vertical" style="width: 100%">
      <tri-date-picker *spaceItem status="error" style="width: 100%"></tri-date-picker>
      <tri-date-picker *spaceItem status="warning" style="width: 100%"></tri-date-picker>
      <tri-range-picker *spaceItem status="error" style="width: 100%"></tri-range-picker>
      <tri-range-picker *spaceItem status="warning" style="width: 100%"></tri-range-picker>
    </tri-space>
  `
})
export class TriDemoDatePickerStatusComponent {}
