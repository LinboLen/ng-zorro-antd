import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';
import { TriFlexModule } from 'ng-zorro-antd/flex';

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
  selector: 'tri-demo-cascader-size',
  imports: [FormsModule, TriCascaderModule, TriFlexModule],
  template: `
    <tri-flex vertical gap="middle">
      <tri-cascader size="large" [options]="options" [(ngModel)]="value1" (ngModelChange)="onChanges($event)" />
      <tri-cascader [options]="options" [(ngModel)]="value2" (ngModelChange)="onChanges($event)" />
      <tri-cascader size="small" [options]="options" [(ngModel)]="value3" (ngModelChange)="onChanges($event)" />
    </tri-flex>
  `
})
export class TriDemoCascaderSizeComponent {
  readonly options: TriCascaderOption[] = options;
  value1: string[] | null = null;
  value2: string[] | null = null;
  value3: string[] | null = null;

  onChanges(values: string[]): void {
    console.log(values);
  }
}
