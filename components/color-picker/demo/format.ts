import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';

@Component({
  selector: 'tri-demo-color-picker-format',
  imports: [FormsModule, TriColorPickerModule],
  template: `
    <div class="format"><tri-color-picker format="hex" [(ngModel)]="hex" /> HEX: {{ hex() }} </div>
    <div class="format"><tri-color-picker format="hsb" [(ngModel)]="hsb" /> HSB: {{ hsb() }} </div>
    <div class="format"><tri-color-picker format="rgb" [(ngModel)]="rgb" /> RGB: {{ rgb() }} </div>
  `,
  styles: `
    .format {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }

    nz-color-picker {
      margin-right: 8px;
    }
  `
})
export class TriDemoColorPickerFormatComponent {
  readonly hex = signal('#1677ff');
  readonly hsb = signal('hsb(215, 91%, 100%)');
  readonly rgb = signal('rgb(22, 119, 255)');
}
