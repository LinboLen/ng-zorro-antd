import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';

const options: TriCascaderOption[] = [
  {
    label: 'Ant Design',
    value: 'antd',
    children: [
      {
        label: 'ng-zorro-antd',
        value: 'ng-zorro-antd',
        isLeaf: true
      }
    ]
  },
  {
    label: 'Angular',
    value: 'angular',
    children: [
      {
        label: 'CDK',
        value: 'cdk',
        isLeaf: true
      }
    ]
  }
];

@Component({
  selector: 'tri-demo-cascader-custom-template',
  imports: [FormsModule, TriCascaderModule],
  template: `
    <tri-cascader
      [optionRender]="renderTpl"
      [options]="options"
      [(ngModel)]="values"
      (ngModelChange)="onChanges($event)"
    />
    <ng-template #renderTpl let-option let-index="index">{{ index + 1 }}. {{ option.label }}</ng-template>
  `
})
export class TriDemoCascaderCustomTemplateComponent {
  readonly options = options;
  values: string[] | null = null;

  onChanges(values: string): void {
    console.log(values, this.values);
  }
}
