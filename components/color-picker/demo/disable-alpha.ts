import { Component } from '@angular/core';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: '',
  imports: [TriColorPickerModule],
  template: `<tri-color-picker disabledAlpha></tri-color-picker>`
})
export class TriDemoColorPickerDisableAlphaComponent {}
