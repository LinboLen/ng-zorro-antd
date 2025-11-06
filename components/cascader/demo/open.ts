import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

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
  selector: 'tri-demo-cascader-open',
  imports: [FormsModule, TriCascaderModule, TriFlexModule, TriSwitchModule],
  template: `
    <div tri-flex vertical gap="small">
      <tri-switch [(ngModel)]="open" checkedChildren="open" unCheckedChildren="close"></tri-switch>
      <tri-cascader
        [options]="options"
        [ngModel]="values"
        [open]="open"
        (selectionChange)="onSelectionChange($event)"
        (visibleChange)="onVisibleChange($event)"
      />
    </div>
  `
})
export class TriDemoCascaderOpenComponent {
  readonly options = options;
  values = ['zhejiang', 'hangzhou', 'xihu'];
  open = false;

  onSelectionChange(selectedOptions: TriCascaderOption[]): void {
    console.log(selectedOptions);
  }

  onVisibleChange(visible: boolean): void {
    console.log(visible);
  }
}
