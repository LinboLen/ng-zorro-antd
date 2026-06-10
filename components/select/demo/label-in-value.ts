import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'tri-demo-select-label-in-value',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select [(ngModel)]="value" [compareWith]="compareFn" allowClear placeHolder="Choose">
      @for (option of options; track option) {
        <tri-option [value]="option" [label]="option.label" />
      }
      <tri-select />
    </tri-select>
  `,
  styles: `
    nz-select {
      width: 120px;
    }
  `
})
export class TriDemoSelectLabelInValueComponent {
  readonly options: Option[] = [
    { label: 'Lucy (101)', value: 'lucy' },
    { label: 'Jack (100)', value: 'jack' }
  ];
  readonly compareFn = (o1: Option, o2: Option): boolean => (o1 && o2 ? o1.value === o2.value : o1 === o2);
  readonly value = signal({ label: 'Jack (100)', value: 'jack' });
}
