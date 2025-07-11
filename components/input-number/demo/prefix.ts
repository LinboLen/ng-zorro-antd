import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'tri-demo-input-number-prefix',
  imports: [FormsModule, TriInputNumberModule, TriIconModule],
  template: `
    <tri-input-number [style.width.%]="100">
      <span inputPrefix>￥</span>
    </tri-input-number>

    <tri-input-number [style.width.%]="100">
      <tri-icon inputAddonBefore type="user" />
      <span inputPrefix>￥</span>
    </tri-input-number>

    <tri-input-number disabled [style.width.%]="100">
      <span inputPrefix>￥</span>
    </tri-input-number>
  `,
  styles: [
    `
      nz-input-number {
        margin-bottom: 8px;
      }
    `
  ]
})
export class TriDemoInputNumberPrefixComponent {}
