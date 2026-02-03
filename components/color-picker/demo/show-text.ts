import { Component } from '@angular/core';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'tri-demo-color-picker-show-text',
  imports: [TriColorPickerModule],
  template: `<tri-color-picker showText />`
})
export class TriDemoColorPickerShowTextComponent {}
