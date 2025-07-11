import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'tri-demo-color-picker-format',
  imports: [FormsModule, TriColorPickerModule],
  template: `
    <div class="format"> <tri-color-picker format="hex" [(ngModel)]="hex"></tri-color-picker> HEX: {{ hex }} </div>
    <div class="format"> <tri-color-picker format="hsb" [(ngModel)]="hsb"></tri-color-picker> HSB: {{ hsb }} </div>
    <div class="format"> <tri-color-picker format="rgb" [(ngModel)]="rgb"></tri-color-picker> RGB: {{ rgb }} </div>
  `,
  styles: [
    `
      .format {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }

      nz-color-picker {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoColorPickerFormatComponent {
  hex: string = '#1677ff';
  hsb: string = 'hsb(215, 91%, 100%)';
  rgb: string = 'rgb(22, 119, 255)';
}
