import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';

const options: TriCascaderOption[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
            isLeaf: true
          }
        ]
      },
      {
        value: 'ningbo',
        label: 'Ningbo',
        isLeaf: true
      }
    ]
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
            isLeaf: true
          }
        ]
      }
    ]
  }
];

@Component({
  selector: 'tri-demo-cascader-trigger',
  imports: [FormsModule, TriCascaderModule],
  template: `
    {{ text() }}
    <tri-cascader
      [showInput]="false"
      [options]="options"
      [ngModel]="values()"
      (ngModelChange)="values.set($event); onChanges($event)"
      (selectionChange)="onSelectionChange($event)"
    >
      <a href="javascript: void(0)">Change city</a>
    </tri-cascader>
  `
})
export class TriDemoCascaderTriggerComponent {
  readonly options: TriCascaderOption[] = options;
  readonly values = signal<string[] | null>(null);
  readonly text = signal('Unselect');

  onChanges(values: string[]): void {
    console.log(values, this.values());
  }

  onSelectionChange(selectedOptions: TriCascaderOption[]): void {
    this.text.set(selectedOptions.map(o => o.label).join(', '));
  }
}
