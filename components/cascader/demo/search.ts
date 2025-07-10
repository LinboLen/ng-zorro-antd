import { Component, OnInit } from '@angular/core';
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
        isLeaf: true,
        disabled: true
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

const otherOptions = [
  {
    value: 'fujian',
    label: 'Fujian',
    children: [
      {
        value: 'xiamen',
        label: 'Xiamen',
        children: [
          {
            value: 'Kulangsu',
            label: 'Kulangsu',
            isLeaf: true
          }
        ]
      }
    ]
  },
  {
    value: 'guangxi',
    label: 'Guangxi',
    children: [
      {
        value: 'guilin',
        label: 'Guilin',
        children: [
          {
            value: 'Lijiang',
            label: 'Li Jiang River',
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
      [options]="options"
      [(ngModel)]="values"
      [showSearch]="true"
      (ngModelChange)="onChanges($event)"
    ></tri-cascader>
    <a (click)="changeNzOptions()" class="change-options">Change Options</a>
  `,
  styles: [
    `
      .change-options {
        display: inline-block;
        font-size: 12px;
        margin-left: 8px;
      }
    `
  ]
})
export class TriDemoCascaderSearchComponent implements OnInit {
  options: TriCascaderOption[] | null = null;
  values: string[] | null = null;

  ngOnInit(): void {
    setTimeout(() => {
      this.options = options;
    }, 100);
  }

  changeNzOptions(): void {
    if (this.options === options) {
      this.options = otherOptions;
    } else {
      this.options = options;
    }
  }

  onChanges(values: string[]): void {
    console.log(values, this.values);
  }
}
