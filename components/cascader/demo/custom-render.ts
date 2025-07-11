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
            code: 752100,
            isLeaf: true
          }
        ]
      },
      {
        value: 'ningbo',
        label: 'Ningbo',
        code: '315000',
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
            code: 453400,
            isLeaf: true
          }
        ]
      }
    ]
  }
];

@Component({
  selector: 'tri-demo-cascader-custom-render',
  imports: [FormsModule, TriCascaderModule],
  template: `
    <tri-cascader
      style="width: 100%;"
      [labelRender]="renderTpl"
      [options]="options"
      [(ngModel)]="values"
      (ngModelChange)="onChanges($event)"
    ></tri-cascader>

    <ng-template #renderTpl let-labels="labels" let-selectedOptions="selectedOptions">
      @for (label of labels; track label) {
        @if (!$last) {
          <span>{{ label }} /</span>
        } @else {
          <span>
            {{ label }} (
            <a href="javascript:;" (click)="handleAreaClick($event, label, selectedOptions[$index])">
              {{ selectedOptions[$index].code }}
            </a>
            )
          </span>
        }
      }
    </ng-template>
  `
})
export class TriDemoCascaderCustomRenderComponent {
  options: TriCascaderOption[] = options;
  values: string[] | null = null;

  onChanges(values: string[]): void {
    console.log(values, this.values);
  }

  handleAreaClick(e: Event, label: string, option: TriCascaderOption): void {
    e.preventDefault();
    e.stopPropagation();
    console.log('clicked "', label, '"', option);
  }
}
