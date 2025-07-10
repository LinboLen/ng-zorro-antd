import { Component } from '@angular/core';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: '',
  imports: [TriColorPickerModule],
  template: `<tri-color-picker trigger="hover"></tri-color-picker>`
})
export class TriDemoColorPickerTriggerComponent {}
