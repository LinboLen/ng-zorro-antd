import { Component } from '@angular/core';

import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';
import { TriSpaceModule } from 'ng-zorro-antd/space';

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
  imports: [TriCascaderModule, TriSpaceModule],
  template: `
    <tri-space direction="vertical" style="width: 100%">
      <tri-cascader *spaceItem [options]="options" variant="outlined" />
      <tri-cascader *spaceItem [options]="options" variant="filled" />
      <tri-cascader *spaceItem [options]="options" variant="borderless" />
      <tri-cascader *spaceItem [options]="options" variant="underlined" />
    </tri-space>
  `
})
export class TriDemoCascaderVariantComponent {
  protected readonly options = options;
}
