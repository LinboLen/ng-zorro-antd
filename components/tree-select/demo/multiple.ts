import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-tree-select-multiple',
  imports: [FormsModule, TriTreeSelectModule],
  template: `
    <tri-tree-select
      style="width: 250px"
      placeHolder="Please select"
      [(ngModel)]="value"
      [maxTagCount]="3"
      [maxTagPlaceholder]="omittedPlaceHolder"
      [nodes]="nodes"
      defaultExpandAll
      multiple
      (ngModelChange)="onChange($event)"
    />
    <ng-template #omittedPlaceHolder let-omittedValues>and {{ omittedValues.length }} more...</ng-template>
  `
})
export class TriDemoTreeSelectMultipleComponent {
  value: string[] = [];
  readonly nodes = [
    {
      title: 'parent 1',
      key: '100',
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          children: [
            { title: 'leaf 1-0-0', key: '10010', isLeaf: true },
            { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
          ]
        },
        {
          title: 'parent 1-1',
          key: '1002',
          children: [{ title: 'leaf 1-1-0', key: '10020', isLeaf: true }]
        }
      ]
    }
  ];

  onChange($event: string[]): void {
    console.log($event);
  }
}
