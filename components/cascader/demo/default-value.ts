import { Component } from '@angular/core';
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
  selector: 'tri-demo-cascader-default-value',
  imports: [FormsModule, TriCascaderModule],
  template: `<tri-cascader [options]="options" [(ngModel)]="values" (ngModelChange)="onChanges($event)" />`
})
export class TriDemoCascaderDefaultValueComponent {
  readonly options: TriCascaderOption[] = options;
  values: string[] = ['zhejiang', 'hangzhou', 'xihu'];

  onChanges(values: string[]): void {
    console.log(values, this.values);
  }
}
