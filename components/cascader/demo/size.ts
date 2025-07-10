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
  selector: '',
  imports: [FormsModule, TriCascaderModule],
  template: `
    <tri-cascader
      [size]="'large'"
      [options]="options"
      [(ngModel)]="value1"
      (ngModelChange)="onChanges($event)"
    ></tri-cascader>
    <br />
    <br />
    <tri-cascader [options]="options" [(ngModel)]="value2" (ngModelChange)="onChanges($event)"></tri-cascader>
    <br />
    <br />
    <tri-cascader
      size="small"
      [options]="options"
      [(ngModel)]="value3"
      (ngModelChange)="onChanges($event)"
    ></tri-cascader>
  `
})
export class TriDemoCascaderSizeComponent {
  options: TriCascaderOption[] = options;
  value1: string[] | null = null;
  value2: string[] | null = null;
  value3: string[] | null = null;

  onChanges(values: string[]): void {
    console.log(values);
  }
}
