import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-options',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select ngModel="lucy" [options]="listOfOption" />
    <tri-select [(ngModel)]="selectedValue" allowClear placeHolder="Choose" [options]="listOfGroupOption" />
  `,
  styles: `
    nz-select {
      margin: 0 8px 10px 0;
      width: 120px;
    }
  `
})
export class TriDemoSelectOptionsComponent {
  selectedValue = 'lucy';
  readonly listOfOption = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'disabled', value: 'disabled', disabled: true }
  ];
  readonly listOfGroupOption = [
    { label: 'Jack', value: 'jack', groupLabel: 'Manager' },
    { label: 'Lucy', value: 'lucy', groupLabel: 'Manager' },
    { label: 'Tom', value: 'tom', groupLabel: 'Engineer' }
  ];
}
