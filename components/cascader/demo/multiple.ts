import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

const getOptions = (): TriCascaderOption[] => [
  {
    label: 'Light',
    value: 'light',
    children: new Array(20).fill(null).map((_, index) => ({ label: `Number ${index}`, value: index, isLeaf: true }))
  },
  {
    label: 'Bamboo',
    value: 'bamboo',
    children: [
      {
        label: 'Little',
        value: 'little',
        children: [
          {
            label: 'Toy Fish',
            value: 'fish',
            isLeaf: true,
            disableCheckbox: true
          },
          {
            label: 'Toy Cards',
            value: 'cards',
            isLeaf: true
          },
          {
            label: 'Toy Bird',
            value: 'bird',
            isLeaf: true
          }
        ]
      }
    ]
  }
];

@Component({
  selector: 'tri-demo-cascader-multiple',
  imports: [FormsModule, TriCascaderModule],
  template: `
    <tri-cascader
      style="width: 100%;"
      [options]="options"
      [(ngModel)]="values"
      (ngModelChange)="onChanges($event)"
      multiple
      [maxTagCount]="3"
    />
  `
})
export class TriDemoCascaderMultipleComponent {
  readonly options: TriCascaderOption[] = getOptions();
  values: TriSafeAny[][] | null = null;

  onChanges(values: TriSafeAny[][]): void {
    console.log(values, this.values);
  }
}
