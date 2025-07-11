import { Component } from '@angular/core';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-date-picker-variant',
  imports: [TriDatePickerModule, TriSpaceModule],
  template: `
    <tri-space direction="vertical" style="width: 100%">
      <tri-date-picker *spaceItem variant="outlined" />
      <tri-date-picker *spaceItem variant="filled" />
      <tri-date-picker *spaceItem variant="borderless" />
      <tri-date-picker *spaceItem variant="underlined" />
    </tri-space>
  `,
  styles: [
    `
      nz-date-picker {
        margin: 0 8px 12px 0;
      }
    `
  ]
})
export class TriDemoDatePickerVariantComponent {}
