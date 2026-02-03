import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriSelectModule, TriSelectOptionInterface } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-prefix-and-suffix',
  imports: [FormsModule, TriSelectModule, TriFlexModule],
  template: `
    <tri-flex wrap="wrap" gap="small">
      <tri-select [(ngModel)]="value" allowClear [style.width.px]="200" prefix="User" [options]="options" />
      <tri-select [(ngModel)]="value" allowClear [style.width.px]="120" suffixIcon="smile" [options]="options" />
      <tri-select
        [(ngModel)]="value"
        allowClear
        [style.width.px]="120"
        suffixIcon="meh"
        disabled
        [options]="options"
      />
      <br />
      <tri-select
        [(ngModel)]="multipleValue"
        allowClear
        [style.width.px]="200"
        mode="tags"
        prefix="User"
        [options]="options"
      />
      <tri-select
        [(ngModel)]="multipleValue"
        allowClear
        [style.width.px]="120"
        mode="tags"
        suffixIcon="smile"
        [options]="options"
      />
      <tri-select
        [(ngModel)]="multipleValue"
        allowClear
        [style.width.px]="120"
        mode="tags"
        suffixIcon="meh"
        disabled
        [options]="options"
      />
    </tri-flex>
  `
})
export class TriDemoSelectPrefixAndSuffixComponent {
  readonly options: TriSelectOptionInterface[] = [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'Yiminghe', label: 'yiminghe' },
    { value: 'disabled', label: 'Disabled', disabled: true }
  ];

  value = model('lucy');
  multipleValue = model(['lucy']);
}
