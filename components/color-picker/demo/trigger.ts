import { Component } from '@angular/core';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'tri-demo-color-picker-trigger',
  imports: [TriColorPickerModule],
  template: `<tri-color-picker trigger="hover"></tri-color-picker>`
})
export class TriDemoColorPickerTriggerComponent {}
