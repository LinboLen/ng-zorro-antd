import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';
import { TriModalModule } from 'ng-zorro-antd/modal';

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
  imports: [FormsModule, TriButtonModule, TriModalModule, TriCascaderModule],
  template: `
    <tri-modal
      [(visibleChange)]="isVisible"
      title="Please select"
      (onCancel)="handleCancel($event)"
      (onOk)="handleOk($event)"
    >
      <tri-cascader
        *modalContent
        [options]="options"
        [(ngModel)]="values"
        (ngModelChange)="onChanges($event)"
      ></tri-cascader>
    </tri-modal>

    <button tri-button (click)="open()">Open Dialog</button>
  `
})
export class TriDemoCascaderModalComponent {
  options: TriCascaderOption[] = options;
  values: string[] | null = null;
  isVisible = false;

  onChanges(values: string[]): void {
    console.log(values, this.values);
  }

  open(): void {
    this.isVisible = true;
  }

  handleOk($event: MouseEvent): void {
    console.log('Button ok clicked!', this.values, $event);
    this.isVisible = false;
  }

  handleCancel($event: MouseEvent): void {
    console.log('Button cancel clicked!', $event);
    this.isVisible = false;
  }
}
