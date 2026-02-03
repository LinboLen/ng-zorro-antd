import { Component } from '@angular/core';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'tri-demo-color-picker-size',
  imports: [TriColorPickerModule],
  template: `
    <tri-color-picker size="large" />
    <br />
    <br />
    <tri-color-picker />
    <br />
    <br />
    <tri-color-picker size="small" />
  `
})
export class TriDemoColorPickerSizeComponent {}
