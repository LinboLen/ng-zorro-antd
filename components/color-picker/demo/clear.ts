import { Component } from '@angular/core';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'tri-demo-color-picker-clear',
  imports: [TriColorPickerModule],
  template: `<tri-color-picker allowClear title="Allow Clear" />`
})
export class TriDemoColorPickerClearComponent {}
