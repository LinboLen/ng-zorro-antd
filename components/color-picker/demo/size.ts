import { Component } from '@angular/core';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: '',
  imports: [TriColorPickerModule],
  template: `
    <tri-color-picker size="large"></tri-color-picker>
    <br />
    <br />
    <tri-color-picker></tri-color-picker>
    <br />
    <br />
    <tri-color-picker size="small"></tri-color-picker>
  `
})
export class TriDemoColorPickerSizeComponent {}
