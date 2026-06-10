import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-tree-select-basic',
  imports: [FormsModule, TriTreeSelectModule],
  template: `
    <tri-tree-select
      style="width: 250px"
      [expandedKeys]="expandKeys"
      [nodes]="nodes"
      showSearch
      placeHolder="Please select"
      [(ngModel)]="value"
    />
  `
})
export class TriDemoTreeSelectBasicComponent {
  readonly expandKeys = ['100', '1001'];
  readonly value = signal('1001');
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
}
