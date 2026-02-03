import { Component } from '@angular/core';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'tri-demo-color-picker-disable-alpha',
  imports: [TriColorPickerModule],
  template: `<tri-color-picker disabledAlpha />`
})
export class TriDemoColorPickerDisableAlphaComponent {}
