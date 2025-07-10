import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule } from 'ng-zorro-antd/cascader';
import { TriInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';
import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: '',
  imports: [FormsModule, TriCascaderModule, TriInputNumberLegacyModule, TriSelectModule, TriSpaceModule],
  template: `
    <tri-space direction="vertical" style="width: 100%">
      <tri-input-number-group *spaceItem addOnBefore="+" addOnAfter="$">
        <tri-input-number [(ngModel)]="value" [step]="1"></tri-input-number>
      </tri-input-number-group>
      <tri-input-number-group *spaceItem [addOnBefore]="addOnBeforeTemplate" [addOnAfter]="addOnAfterTemplate">
        <tri-input-number [(ngModel)]="value" [step]="1"></tri-input-number>
      </tri-input-number-group>
      <ng-template #addOnBeforeTemplate>
        <tri-select [ngModel]="'add'" style="width: 60px">
          <tri-option label="+" value="add"></tri-option>
          <tri-option label="-" value="minus"></tri-option>
        </tri-select>
      </ng-template>
      <ng-template #addOnAfterTemplate>
        <tri-select [ngModel]="'USD'" style="width: 60px">
          <tri-option value="USD" label="$"></tri-option>
          <tri-option value="EUR" label="€"></tri-option>
          <tri-option value="GBP" label="£"></tri-option>
          <tri-option value="CNY" label="¥"></tri-option>
        </tri-select>
      </ng-template>
      <tri-input-number-group *spaceItem addOnAfterIcon="setting">
        <tri-input-number [(ngModel)]="value" [step]="1"></tri-input-number>
      </tri-input-number-group>
      <tri-input-number-group *spaceItem [addOnBefore]="addOnBeforeCascaderTemplate">
        <tri-input-number [(ngModel)]="value" [step]="1"></tri-input-number>
      </tri-input-number-group>
      <ng-template #addOnBeforeCascaderTemplate>
        <tri-cascader [options]="[]" placeHolder="cascader" style="width: 150px"></tri-cascader>
      </ng-template>
    </tri-space>
  `
})
export class TriDemoInputNumberLegacyAddonComponent {
  value = 100;
}
