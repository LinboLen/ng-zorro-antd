import { Component } from '@angular/core';

import { TriSpaceModule } from 'ng-zorro-antd/space';
import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: '',
  imports: [TriTimePickerModule, TriSpaceModule],
  template: ` <tri-space direction="vertical" style="width: 100%">
    <tri-time-picker *spaceItem variant="outlined" />
    <tri-time-picker *spaceItem variant="filled" />
    <tri-time-picker *spaceItem variant="borderless" />
    <tri-time-picker *spaceItem variant="underlined" />
  </tri-space>`
})
export class TriDemoTimePickerVariantComponent {}
