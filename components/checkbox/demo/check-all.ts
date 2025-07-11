import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCheckboxModule, TriCheckboxOption } from 'ng-zorro-antd/checkbox';
import { TriDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'tri-demo-checkbox-check-all',
  imports: [FormsModule, TriCheckboxModule, TriDividerModule],
  template: `
    <label
      tri-checkbox
      [(ngModel)]="allChecked"
      (ngModelChange)="updateAllChecked()"
      [indeterminate]="value.length > 0 && value.length !== options.length"
    >
      Check all
    </label>

    <tri-divider />

    <tri-checkbox-group
      [options]="options"
      [(ngModel)]="value"
      (ngModelChange)="updateSingleChecked()"
    ></tri-checkbox-group>
  `
})
export class TriDemoCheckboxCheckAllComponent {
  isAllCheckedFirstChange = true;
  allChecked = false;
  value: Array<string | number> = ['Apple', 'Orange'];
  options: TriCheckboxOption[] = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
  ];

  updateAllChecked(): void {
    if (!this.isAllCheckedFirstChange) {
      this.value = this.allChecked ? this.options.map(item => item.value) : [];
    }
    this.isAllCheckedFirstChange = false;
  }

  updateSingleChecked(): void {
    this.allChecked = this.value.length === this.options.length;
  }
}
