import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-tree-select-prefix-and-suffix',
  imports: [FormsModule, TriTreeSelectModule],
  template: `
    <tri-tree-select [nodes]="nodes" suffixIcon="smile" [(ngModel)]="value" defaultExpandAll />
    <br />
    <br />
    <tri-tree-select [nodes]="nodes" prefix="Prefix" [(ngModel)]="value" defaultExpandAll />
  `,
  styles: `
    nz-tree-select {
      width: 100%;
    }
  `
})
export class TriDemoTreeSelectPrefixAndSuffixComponent {
  readonly value = model();
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
