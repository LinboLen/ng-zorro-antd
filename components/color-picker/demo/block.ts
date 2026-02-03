import { Component } from '@angular/core';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'tri-demo-color-picker-block',
  imports: [TriColorPickerModule],
  template: `
    <tri-color-block size="small" />
    <tri-color-block />
    <tri-color-block size="large" />
  `,
  styles: `
    nz-color-block {
      margin-right: 12px;
    }
  `
})
export class TriDemoColorPickerBlockComponent {}
