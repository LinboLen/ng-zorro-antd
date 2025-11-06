import { Component } from '@angular/core';

import { TriCascaderModule, TriCascaderOption, TriCascaderPlacement } from 'ng-zorro-antd/cascader';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

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
  selector: 'tri-demo-cascader-placement',
  imports: [TriCascaderModule, TriSegmentedModule],
  template: `
    <tri-segmented [options]="placements" (valueChange)="setPlacement($event)"></tri-segmented>
    <br />
    <br />
    <tri-cascader [options]="options" [placement]="placement" />
  `
})
export class TriDemoCascaderPlacementComponent {
  readonly options: TriCascaderOption[] = options;
  placement: TriCascaderPlacement = 'topLeft';
  readonly placements: TriCascaderPlacement[] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

  setPlacement(placement: string | number): void {
    this.placement = placement as TriCascaderPlacement;
  }
}
