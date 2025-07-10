import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule } from 'ng-zorro-antd/cascader';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';
import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: '',
  imports: [FormsModule, TriSelectModule, TriCascaderModule, TriInputNumberModule, TriIconModule],
  template: `
    <tri-input-number [(ngModel)]="value">
      <span inputAddonBefore>+</span>
      <span inputAddonAfter>$</span>
    </tri-input-number>

    <tri-input-number [(ngModel)]="value">
      <tri-select inputAddonBefore [ngModel]="'add'" [style.width.px]="60">
        <tri-option label="+" value="add"></tri-option>
        <tri-option label="-" value="minus"></tri-option>
      </tri-select>
      <tri-select inputAddonAfter [ngModel]="'USD'" [style.width.px]="60">
        <tri-option value="USD" label="$"></tri-option>
        <tri-option value="EUR" label="€"></tri-option>
        <tri-option value="GBP" label="£"></tri-option>
        <tri-option value="CNY" label="¥"></tri-option>
      </tri-select>
    </tri-input-number>

    <tri-input-number [(ngModel)]="value">
      <tri-icon inputAddonAfter type="setting" />
    </tri-input-number>

    <tri-input-number [(ngModel)]="value">
      <tri-cascader inputAddonBefore [options]="[]" placeHolder="cascader" [style.width.px]="150" />
    </tri-input-number>
  `,
  styles: [
    `
      nz-input-number {
        display: block;
        margin-bottom: 8px;
      }
    `
  ]
})
export class TriDemoInputNumberAddonComponent {
  value = 100;
}
