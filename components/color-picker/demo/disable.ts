import { Component } from '@angular/core';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'tri-demo-color-picker-disable',
  imports: [TriColorPickerModule],
  template: `<tri-color-picker disabled showText></tri-color-picker>`
})
export class TriDemoColorPickerDisableComponent {}
