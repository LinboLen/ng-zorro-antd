import { Component } from '@angular/core';

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
  selector: 'tri-demo-cascader-variant',
  imports: [TriCascaderModule, TriFlexModule],
  template: `
    <tri-flex vertical gap="middle">
      <tri-cascader [options]="options" variant="outlined" />
      <tri-cascader [options]="options" variant="filled" />
      <tri-cascader [options]="options" variant="borderless" />
      <tri-cascader [options]="options" variant="underlined" />
    </tri-flex>
  `
})
export class TriDemoCascaderVariantComponent {
  readonly options = options;
}
