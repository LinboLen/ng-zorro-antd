import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';
import { TriFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'tri-demo-cascader-status',
  imports: [FormsModule, TriCascaderModule, TriFlexModule],
  template: `
    <tri-flex vertical gap="middle">
      <tri-cascader [options]="options" status="error" />
      <tri-cascader [options]="options" status="warning" />
    </tri-flex>
  `
})
export class TriDemoCascaderStatusComponent {
  readonly options: TriCascaderOption[] = [];
}
