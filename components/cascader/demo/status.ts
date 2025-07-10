import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';

@Component({
  selector: '',
  imports: [FormsModule, TriCascaderModule],
  template: `
    <tri-cascader [options]="options" status="error"></tri-cascader>
    <br />
    <br />
    <tri-cascader [options]="options" status="warning"></tri-cascader>
  `
})
export class TriDemoCascaderStatusComponent {
  options: TriCascaderOption[] = [];
}
