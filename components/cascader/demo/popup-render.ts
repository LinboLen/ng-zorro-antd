import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';
import { TriDividerModule } from 'ng-zorro-antd/divider';

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
  selector: 'tri-demo-cascader-popup-render',
  imports: [FormsModule, NgTemplateOutlet, TriCascaderModule, TriDividerModule],
  template: `
    <tri-cascader [options]="options" [popupRender]="popupRenderTpl" [(ngModel)]="values" />

    <ng-template #popupRenderTpl let-menu>
      <div style="padding: 8px; color: #1890ff">This is header.</div>
      <tri-divider style="margin: 0" />
      <ng-container [ngTemplateOutlet]="menu" />
      <tri-divider style="margin: 0" />
      <div style="padding: 8px">The footer is not very short.</div>
    </ng-template>
  `
})
export class TriDemoCascaderPopupRenderComponent {
  readonly options: TriCascaderOption[] = options;
  values: string[] | null = null;
}
