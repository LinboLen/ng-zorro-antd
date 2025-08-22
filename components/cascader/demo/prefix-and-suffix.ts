import { Component } from '@angular/core';

import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriIconModule } from 'ng-zorro-antd/icon';

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
  selector: 'tri-demo-cascader-prefix-and-suffix',
  imports: [TriCascaderModule, TriFlexModule, TriIconModule],
  template: `
    <tri-flex vertical gap="small">
      <tri-cascader [options]="options" suffixIcon="smile"></tri-cascader>
      <tri-cascader [options]="options" expandIcon="smile"></tri-cascader>
      <tri-cascader [options]="options" [prefix]="smile"></tri-cascader>
    </tri-flex>
    <ng-template #smile><tri-icon type="smile" /></ng-template>
  `
})
export class TriDemoCascaderPrefixAndSuffixComponent {
  readonly options: TriCascaderOption[] = options;
}
