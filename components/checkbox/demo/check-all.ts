import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCheckboxModule, TriCheckboxOption } from 'ng-zorro-antd/checkbox';
import { TriDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'tri-demo-checkbox-check-all',
  imports: [FormsModule, TriCheckboxModule, TriDividerModule],
  template: `
    <label
      tri-checkbox
      [ngModel]="allChecked()"
      (ngModelChange)="onAllCheckedChange($event)"
      [indeterminate]="indeterminate()"
    >
      Check all
    </label>

    <tri-divider />

    <tri-checkbox-group [options]="options" [(ngModel)]="value" />
  `
})
export class TriDemoCheckboxCheckAllComponent {
  readonly value = signal<Array<TriCheckboxOption['value']>>(['Apple', 'Orange']);
  readonly options: TriCheckboxOption[] = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
  ];
  readonly allChecked = computed(() => this.value().length === this.options.length);
  readonly indeterminate = computed(() => this.value().length > 0 && !this.allChecked());

  onAllCheckedChange(checked: boolean): void {
    this.value.set(checked ? this.options.map(item => item.value) : []);
  }
}
