import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriFlexDirective } from 'ng-zorro-antd/flex';
import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-select-variant',
  imports: [FormsModule, TriSelectModule, TriSpaceModule, TriFlexDirective],
  template: `
    <div tri-flex gap="large">
      <tri-space direction="vertical" style="flex: 1">
        <tri-select *spaceItem ngModel="lucy" [options]="options"></tri-select>
        <tri-select *spaceItem ngModel="lucy" variant="filled" [options]="options"></tri-select>
        <tri-select *spaceItem ngModel="lucy" variant="borderless" [options]="options"></tri-select>
        <tri-select *spaceItem ngModel="lucy" variant="underlined" [options]="options"></tri-select>
      </tri-space>
      <tri-space direction="vertical" style="flex: 1">
        <tri-select *spaceItem mode="multiple" [ngModel]="['lucy']" [options]="options"></tri-select>
        <tri-select
          *spaceItem
          mode="multiple"
          [ngModel]="['lucy']"
          variant="filled"
          [options]="options"
        ></tri-select>
        <tri-select
          *spaceItem
          mode="multiple"
          [ngModel]="['lucy']"
          variant="borderless"
          [options]="options"
        ></tri-select>
        <tri-select
          *spaceItem
          mode="multiple"
          [ngModel]="['lucy']"
          variant="underlined"
          [options]="options"
        ></tri-select>
      </tri-space>
    </div>
  `,
  styles: `
    nz-space {
      flex: 1;
    }

    nz-select {
      width: 100%;
    }
  `
})
export class TriDemoSelectVariantComponent {
  options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Disabled', value: 'disabled', disabled: true }
  ];
}
