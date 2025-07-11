import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-optgroup',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select [(ngModel)]="selectedValue" allowClear placeHolder="Choose" showSearch>
      <tri-option-group label="Manager">
        <tri-option value="jack" label="Jack"></tri-option>
        <tri-option value="lucy" label="Lucy"></tri-option>
      </tri-option-group>
      <tri-option-group label="Engineer">
        <tri-option value="tom" label="Tom"></tri-option>
      </tri-option-group>
    </tri-select>
  `,
  styles: [
    `
      nz-select {
        width: 120px;
      }
    `
  ]
})
export class TriDemoSelectOptgroupComponent {
  selectedValue = 'lucy';
}
